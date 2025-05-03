# AI-Legal-Clause-Extractor
# ⚖️ AI Legal Clause Extractor

The **AI Legal Clause Extractor** is a web application that allows users to upload legal documents (PDFs), automatically extract key clauses (e.g., Termination, Confidentiality, Governing Law), and display them in an organized and readable format.

This tool is designed to help legal professionals, paralegals, and researchers save time by leveraging OpenAI's GPT-4 or GPT-3.5 to understand and extract legally significant sections from complex documents.

---

## 🚀 Features

- 🔼 Upload PDF legal documents
- 🧠 Uses OpenAI to extract key clauses
- 🧾 Displays extracted clauses in a clean UI
- ⚡ Built with full-stack TypeScript (React + Express)
- 💬 Easily extendable to support summaries or clause classification

---

## 🛠 Tech Stack

| Part       | Stack                     |
|------------|---------------------------|
| Frontend   | React + TypeScript        |
| Backend    | Node.js + Express + TS    |
| AI         | OpenAI API (GPT-4 or 3.5) |
| File Parsing | `pdf-parse` (Node)       |

---

## 📁 Folder Structure

```
ai-legal-clause-extractor/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── upload.routes.ts
│   │   ├── utils/
│   │   │   └── extractText.ts
│   │   └── app.ts
│   └── uploads/ (PDF storage)
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── DocumentUpload.tsx
│       │   └── ExtractedClauses.tsx
│       └── services/api.ts
```

---

## 🧠 How It Works

1. **User uploads a PDF** via the frontend
2. **Backend parses** the PDF text using `pdf-parse`
3. The raw text is **sent to OpenAI** with a prompt like:
   > "Extract the following clauses from this contract: Termination, Confidentiality, Governing Law, Dispute Resolution..."
4. The AI's structured response is sent back to the frontend
5. Clauses are shown in expandable cards (accordion-style)

---

## 🔐 OpenAI Setup
1. Get your API key from https://platform.openai.com
2. Add a `.env` file in the `backend/` folder:

```
OPENAI_API_KEY=your-key-here
PORT=3001
```

---

## 📦 Install & Run

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

---

## ✨ Future Enhancements
- Highlight source text in full document
- Export clause results to Word or PDF
- Add clause classification or risk score
- Support for DOCX and multi-page scans

---

## 📄 License
MIT
