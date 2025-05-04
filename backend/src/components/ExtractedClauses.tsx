import React from "react";

interface Clause {
  title: string;
  text: string;
  summary: string;
}

interface ExtractedClausesProps {
  clauses: Clause[];
}

const ExtractedClauses: React.FC<ExtractedClausesProps> = ({ clauses }) => {
  if (!clauses || clauses.length === 0) {
    return null;
  }

  return (
    <div className="extracted-clauses">
      <h2>Extracted Legal Clauses</h2>

      {clauses.map((clause, index) => (
        <details key={index} className="clause-card">
          <summary className="clause-title">
            {clause.title}
            {clause.text ? (
              <span className="clause-badge found">Found</span>
            ) : (
              <span className="clause-badge not-found">Not Found</span>
            )}
          </summary>

          <div className="clause-content">
            {clause.summary && (
              <div className="clause-summary">
                <h4>Summary</h4>
                <p>{clause.summary}</p>
              </div>
            )}

            {clause.text ? (
              <div className="clause-full-text">
                <h4>Full Text</h4>
                <p>{clause.text}</p>
              </div>
            ) : (
              <div className="clause-not-found">
                <p>This clause was not found in the document.</p>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default ExtractedClauses;
