import React, { useState } from "react";
import axios from "axios";

interface DocumentUploadProps {
  onClausesExtracted: (clauses: any[]) => void;
  setIsLoading: (loading: boolean) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onClausesExtracted,
  setIsLoading,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onClausesExtracted(response.data.clauses);
    } catch (err: any) {
      console.error("Upload error:", err);

      if (err.response) {
        const errorMessage =
          err.response.data.error || err.response.data.message;
        if (
          errorMessage.includes("quota") ||
          errorMessage.includes("rate limit")
        ) {
          setError(
            "The AI service is currently unavailable due to usage limits. Please try again later."
          );
        } else {
          setError(`Error: ${errorMessage}`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="document-upload">
      <h2>Upload Legal Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="upload-area">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            id="file-upload"
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            {file ? file.name : "Choose a file"}
          </label>
          <p className="file-info">
            {file
              ? `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(
                  2
                )} MB)`
              : "Supported formats: PDF, DOC, DOCX"}
          </p>
        </div>

        <button type="submit" className="upload-button">
          Extract Clauses
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default DocumentUpload;
