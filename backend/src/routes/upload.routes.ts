import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../config/env";
import { extractClauses } from "../utils/aiProcessor";
import { PDFExtract } from "pdf.js-extract";

const uploadDir = path.join(__dirname, "..", "..", "uploads");
const pdfExtract = new PDFExtract();
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Basic clause extraction function as fallback when AI is unavailable
function performBasicClauseExtraction(text: string) {
  // Define common legal clause patterns to look for
  const clausePatterns = [
    {
      title: "Confidentiality",
      regex:
        /\b(confidential(ity)?|non-disclosure)\b.{0,100}(information|data|material)/gi,
      summary:
        "Requires parties to keep certain information private and secure.",
    },
    {
      title: "Termination",
      regex:
        /\b(terminat(e|ion)|cancel(lation)?)\b.{0,100}(agreement|contract)/gi,
      summary: "Specifies how and when the agreement can be ended.",
    },
    {
      title: "Governing Law",
      regex:
        /\b(govern(ing|ed) (by )?law|jurisdiction)\b.{0,100}(state|country|province|territory)/gi,
      summary: "Establishes which laws and courts will govern the agreement.",
    },
    {
      title: "Limitation of Liability",
      regex: /\b(limit(ation|ed)? (of )?liab(le|ility))\b/gi,
      summary: "Limits the amount or types of damages that can be claimed.",
    },
    {
      title: "Force Majeure",
      regex: /\b(force majeure|act(s)? of god|unforeseen circumstance(s)?)\b/gi,
      summary: "Excuses performance due to events beyond reasonable control.",
    },
    {
      title: "Intellectual Property",
      regex: /\b(intellectual property|patent|copyright|trademark)\b/gi,
      summary: "Addresses ownership and rights to intellectual creations.",
    },
    {
      title: "Payment Terms",
      regex:
        /\b(payment( terms)?|fee(s)?|compensation)\b.{0,100}(day(s)?|month(s)?|due)/gi,
      summary: "Details when and how payments should be made.",
    },
    {
      title: "Warranty",
      regex: /\b(warrant(y|ies)|guarantee(s)?)\b/gi,
      summary:
        "Promises about the quality or performance of goods or services.",
    },
    {
      title: "Indemnification",
      regex: /\b(indemnif(y|ication)|hold harmless)\b/gi,
      summary: "Requires one party to compensate the other for losses.",
    },
    {
      title: "Assignment",
      regex:
        /\b(assign(ment)?|transfer)\b.{0,100}(rights|obligations|agreement|contract)/gi,
      summary: "Addresses whether rights or obligations can be transferred.",
    },
  ];

  // Find clauses in text
  const extractedClauses = clausePatterns.map((pattern) => {
    const matches = [...text.matchAll(pattern.regex)];
    if (matches.length > 0) {
      // Get the context around the first match (50 chars before, 200 after)
      const matchIndex = matches[0].index || 0;
      const startIndex = Math.max(0, matchIndex - 50);
      const endIndex = Math.min(text.length, matchIndex + 200);
      const clauseText = text.substring(startIndex, endIndex).trim();

      return {
        title: pattern.title,
        text: clauseText,
        summary: pattern.summary,
      };
    } else {
      return {
        title: pattern.title,
        text: "",
        summary: pattern.summary,
      };
    }
  });

  return {
    clauses: extractedClauses.filter((clause) => clause.text !== ""),
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (config.upload.allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${config.upload.allowedTypes.join(
            ", "
          )}`
        )
      );
    }
  },
});

const router = Router();

router.post("/", (req: Request, res: Response) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ message: `Upload error: ${err.message}` });
      } else {
        return res
          .status(500)
          .json({ message: `Server error: ${err.message}` });
      }
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(uploadDir, file.filename);

    try {
      const dataBuffer = await fs.promises.readFile(filePath);

      if (file.mimetype === "application/pdf") {
        try {
          const data = await pdfExtract.extractBuffer(dataBuffer);

          // Extract text from all pages
          let fullText = "";
          data.pages.forEach((page) => {
            page.content.forEach((item) => {
              fullText += item.str + " ";
            });
            fullText += "\n\n"; // Add line breaks between pages
          });

          try {
            // First try with AI
            const extractedClauses = await extractClauses(fullText);

            res.status(201).json({
              message: "File uploaded and clauses extracted",
              file: {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
              },
              clauses: extractedClauses.clauses,
            });
          } catch (aiError: any) {
            // If AI fails (e.g., quota exceeded), fall back to basic extraction
            console.error("AI extraction error:", aiError);

            // Check if error is related to OpenAI quota
            const isQuotaError =
              aiError.message?.includes("quota") ||
              aiError.message?.includes("rate limit") ||
              aiError.message?.includes("429");

            if (isQuotaError) {
              console.log(
                "Using fallback clause extraction due to AI quota limits"
              );

              const basicClauses = performBasicClauseExtraction(fullText);

              res.status(201).json({
                message:
                  "File uploaded and basic clauses extracted (AI unavailable)",
                file: {
                  filename: file.filename,
                  originalName: file.originalname,
                  size: file.size,
                  mimetype: file.mimetype,
                },
                clauses: basicClauses.clauses,
                aiUnavailable: true,
              });
            } else {
              throw aiError;
            }
          }
        } catch (pdfError: unknown) {
          console.error("PDF extraction error:", pdfError);
          return res.status(400).json({
            message: "Could not extract text from the PDF",
            error:
              pdfError instanceof Error ? pdfError.message : String(pdfError),
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Only PDF files are currently supported" });
      }
    } catch (parseError: unknown) {
      console.error("Document processing error:", parseError);
      return res.status(500).json({
        message: "Failed to process document",
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
      });
    }
  });
});

router.post("/extract", function (req: Request, res: Response) {
  (async function () {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ message: "No text provided" });
      }

      try {
        // First try with AI
        const extractedClauses = await extractClauses(text);

        res.status(200).json({
          message: "Clauses extracted successfully",
          clauses: extractedClauses.clauses,
        });
      } catch (aiError: any) {
        console.error("AI extraction error:", aiError);

        const isQuotaError =
          aiError.message?.includes("quota") ||
          aiError.message?.includes("rate limit") ||
          aiError.message?.includes("429");

        if (isQuotaError) {
          console.log(
            "Using fallback clause extraction due to AI quota limits"
          );
          const basicClauses = performBasicClauseExtraction(text);

          res.status(200).json({
            message: "Basic clauses extracted (AI unavailable)",
            clauses: basicClauses.clauses,
            aiUnavailable: true,
          });
        } else {
          throw aiError;
        }
      }
    } catch (err: any) {
      console.error("Text extraction error:", err);
      return res.status(500).json({
        message: "Failed to extract clauses",
        error: err.message || String(err),
      });
    }
  })();
});

export default router;
