import * as React from "react";
import Header from "./Header";
import ClausesList from "./ClausesList";
import { Clause } from "../types";
import { getDocumentText } from "../helpers/documentHelpers";
import axios from "axios";

export interface AppProps {}

export interface AppState {
  clauses: Clause[];
  isLoading: boolean;
  error: string | null;
  documentProcessed: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      clauses: [],
      isLoading: false,
      error: null,
      documentProcessed: false,
    };
  }

  extractClauses = async () => {
    this.setState({
      isLoading: true,
      error: null,
      documentProcessed: false,
    });

    try {
      // Get the document text
      const documentText = await getDocumentText();

      if (!documentText) {
        throw new Error("Could not retrieve document text");
      }

      // Send the text to your backend API
      const response = await axios.post("http://localhost:3001/api/extract", {
        text: documentText,
      });

      this.setState({
        clauses: response.data.clauses,
        isLoading: false,
        documentProcessed: true,
      });
    } catch (error) {
      console.error("Error extracting clauses:", error);
      this.setState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  render() {
    const { clauses, isLoading, error, documentProcessed } = this.state;

    return (
      <div className="ms-welcome">
        <Header
          title="Legal Clause Extractor"
          message="Extract key legal clauses from your document"
        />
        <main className="ms-welcome__main">
          <button
            className="action-button"
            onClick={this.extractClauses}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Extract Clauses"}
          </button>

          {isLoading && (
            <div>
              <div className="loading-spinner"></div>
              <p className="loading-text">Analyzing document with AI...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {documentProcessed && !isLoading && (
            <div className="results">
              <h2>Extracted Clauses</h2>
              <ClausesList clauses={clauses} />
            </div>
          )}
        </main>
        <footer>
          <div>Powered by AI | © 2025 Your Company</div>
        </footer>
      </div>
    );
  }
}
