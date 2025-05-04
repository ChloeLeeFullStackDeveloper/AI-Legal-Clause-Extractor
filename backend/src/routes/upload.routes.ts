import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../config/env";
import { extractClauses } from "../utils/aiProcessor";

const pdfParse = require("pdf-parse");

const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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
      const pdfData = await pdfParse(dataBuffer);

      const extractedClauses = await extractClauses(pdfData.text);

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
    } catch (parseError: any) {
      console.error("Document processing error:", parseError);
      return res.status(500).json({
        message: "Failed to process document",
        error: parseError.message || String(parseError),
      });
    }
  });
});

export default router;
