import React, { useState } from 'react';

interface Clause {
  title: string;
  text: string;
  summary: string;
}

interface ExtractedClausesProps {
  clauses: Clause[];
}

const ExtractedClauses: React.FC<ExtractedClausesProps> = ({ clauses }) => {
  const [expandedClause, setExpandedClause] = useState<number | null>(null);

  const toggleClause = (index: number) => {
    setExpandedClause(expandedClause === index ? null : index);
  };

  if (!clauses || clauses.length === 0) {
    return <div className="no-clauses">No clauses were extracted from the document.</div>;
  }

  return (
    <div className="extracted-clauses">
      <h2>Extracted Legal Clauses</h2>
      <div className="clauses-list">
        {clauses.map((clause, index) => (
          <div key={index} className="clause-card">
            <div 
              className="clause-header" 
              onClick={() => toggleClause(index)}
            >
              <span className="clause-title">{clause.title}</span>
              {clause.text ? (
                <span className="clause-badge found">Found</span>
              ) : (
                <span className="clause-badge not-found">Not Found</span>
              )}
            </div>
            
            {expandedClause === index && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtractedClauses;