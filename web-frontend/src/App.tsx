import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import DocumentUpload from "./components/DocumentUpload";
import ExtractedClauses from "./components/ExtractedClauses";

interface Clause {
  title: string;
  text: string;
  summary: string;
}

function App() {
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleClausesExtracted = (extractedClauses: Clause[]) => {
    setClauses(extractedClauses);
    setIsProcessed(true);
  };

  return (
    <div className="App">
      <Header />
      <main className="app-content">
        <DocumentUpload
          onClausesExtracted={handleClausesExtracted}
          setIsLoading={setIsLoading}
        />

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Analyzing document with AI...</p>
          </div>
        )}

        {isProcessed && !isLoading && <ExtractedClauses clauses={clauses} />}
      </main>
      <footer className="app-footer">
        <p>Powered by AI | © 2025 Your Company</p>
      </footer>
    </div>
  );
}

export default App;
