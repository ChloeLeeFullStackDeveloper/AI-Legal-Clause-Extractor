import React, { useState } from 'react';
import axios from 'axios';

interface DocumentUploadProps {
  onExtracted: (clauses: any) => void;
  onUploadStart: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onExtracted, onUploadStart }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
    
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        setError(`Invalid file type. Please upload a PDF, DOC, or DOCX file.`);
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError(null);
    onUploadStart();
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onExtracted(response.data.clauses);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload and process file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="document-upload">
      <h2>Upload Legal Document</h2>
      <p>Upload a legal document (PDF, DOC, DOCX) to extract key clauses</p>
      
      <form onSubmit={handleUpload}>
        <div className="file-input-container">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx"
            id="file-upload"
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className={`file-input-label ${isLoading ? 'disabled' : ''}`}>
            {selectedFile ? selectedFile.name : 'Choose a file'}
          </label>
        </div>
        
        {selectedFile && (
          <div className="selected-file">
            <p>Selected: {selectedFile.name}</p>
            <button 
              type="submit" 
              className="upload-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Extract Clauses'}
            </button>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing document with AI. This may take a minute...</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default DocumentUpload;