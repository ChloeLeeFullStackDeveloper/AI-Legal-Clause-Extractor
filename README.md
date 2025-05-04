# AI Legal Clause Extractor

A powerful tool that leverages AI to automatically extract key legal clauses from legal documents. The system analyzes documents to identify and extract important clauses such as Termination, Confidentiality, Governing Law, and more.

## 🚀 Features

* 📄 Extract key legal clauses from documents
* 🧠 Powered by OpenAI's advanced language models
* 📱 Multiple interfaces: Web Application and Microsoft Word Add-in
* 📋 Easily view and navigate through extracted clauses
* 🔍 Highlight clauses directly in Word documents

## 📋 Project Overview

This project consists of three main components:

1. **Backend API**: Node.js/Express server that processes documents and communicates with OpenAI
2. **Web Frontend**: React-based web application for uploading and analyzing documents
3. **Word Add-in**: Microsoft Word integration for analyzing documents directly within Word

## 🔧 Technical Stack

### Backend
- Node.js & Express
- TypeScript
- OpenAI API integration
- PDF parsing (`pdf-parse`)

### Web Frontend
- React
- TypeScript
- Axios for API communication

### Word Add-in
- Office.js API
- React
- TypeScript
- Webpack

## 📁 Project Structure

```
ai-legal-clause-extractor/
├── backend/                # Node.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── routes/         # API route handlers
│   │   ├── utils/          # Utility functions
│   │   └── app.ts          # Express application
│   ├── uploads/            # Temporary storage for uploaded files
│   └── .env                # Environment variables
│
├── web-frontend/           # React web application (optional)
│   ├── public/
│   └── src/
│       ├── components/
│       └── services/
│
└── word-addin/             # Microsoft Word Add-in
    ├── src/
    │   ├── taskpane/       # Add-in taskpane components
    │   │   ├── components/ # React components
    │   │   └── helpers/    # Helper functions
    │   └── test.ts         # TypeScript test file
    ├── assets/             # Static assets like icons
    ├── manifest.xml        # Word Add-in manifest
    ├── tsconfig.json       # TypeScript configuration
    └── webpack.config.js   # Webpack configuration
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The backend will be available at http://localhost:3001.

### Word Add-in Setup

1. Navigate to the Word Add-in directory:
   ```
   cd word-addin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Sideload the Add-in in Word:
   - Open Word
   - Go to Insert > Add-ins > My Add-ins > Upload My Add-in
   - Browse to the `manifest.xml` file in the `word-addin/dist` directory

## 📝 Usage

### Using the Web Interface

1. Navigate to the web application
2. Upload a legal document in PDF, DOC, or DOCX format
3. Wait for processing
4. Review extracted clauses, organized by type

### Using the Word Add-in

1. Open a legal document in Microsoft Word
2. Launch the Legal Clause Extractor add-in from the ribbon
3. Click "Extract Clauses" in the task pane
4. Review extracted clauses
5. Use the "Highlight in Document" feature to see clauses in context

## 🧩 API Endpoints

- `POST /api/upload`: Upload and process a document file
- `POST /api/extract`: Process document text (used by Word Add-in)

## 🛠️ Development

### Backend Development

Extend the backend by:
- Adding support for additional file types
- Implementing more sophisticated clause detection
- Adding database storage for processed documents

### Add-in Development

Enhance the Word Add-in by:
- Adding clause categorization
- Implementing clause comparison against templates
- Adding export functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- OpenAI for providing the AI capabilities
- Microsoft for the Office Add-ins platform