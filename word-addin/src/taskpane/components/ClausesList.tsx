import * as React from "react";
import { Clause } from "../types";
import { highlightTextInDocument } from "../helpers/documentHelpers";

export interface ClausesListProps {
  clauses: Clause[];
}

export interface ClausesListState {
  expandedClauses: { [key: string]: boolean };
  highlightStatus: {
    [key: string]: "none" | "highlighting" | "success" | "error";
  };
  highlightErrors: { [key: string]: string };
}

export default class ClausesList extends React.Component<
  ClausesListProps,
  ClausesListState
> {
  constructor(props: ClausesListProps) {
    super(props);
    this.state = {
      expandedClauses: {},
      highlightStatus: {},
      highlightErrors: {},
    };
  }

  toggleClauseExpand = (index: number) => {
    this.setState((prevState) => ({
      expandedClauses: {
        ...prevState.expandedClauses,
        [index]: !prevState.expandedClauses[index],
      },
    }));
  };

  highlightClause = async (text: string, index: number) => {
    this.setState((prevState) => ({
      highlightStatus: {
        ...prevState.highlightStatus,
        [index]: "highlighting",
      },
    }));

    try {
      await highlightTextInDocument(text);

      this.setState((prevState) => ({
        highlightStatus: {
          ...prevState.highlightStatus,
          [index]: "success",
        },
      }));

      setTimeout(() => {
        this.setState((prevState) => ({
          highlightStatus: {
            ...prevState.highlightStatus,
            [index]: "none",
          },
        }));
      }, 2000);
    } catch (error) {
      console.error("Error highlighting clause:", error);

      this.setState((prevState) => ({
        highlightStatus: {
          ...prevState.highlightStatus,
          [index]: "error",
        },
        highlightErrors: {
          ...prevState.highlightErrors,
          [index]: error instanceof Error ? error.message : "Unknown error",
        },
      }));
    }
  };

  render() {
    const { clauses } = this.props;
    const { expandedClauses, highlightStatus, highlightErrors } = this.state;

    if (!clauses || clauses.length === 0) {
      return <div>No clauses found.</div>;
    }

    return (
      <div className="clauses-list">
        {clauses.map((clause, index) => (
          <div key={index} className="clause-card">
            <div
              className="clause-header"
              onClick={() => this.toggleClauseExpand(index)}
            >
              <span className="clause-title">{clause.title}</span>
              {clause.text ? (
                <span className="clause-badge found">Found</span>
              ) : (
                <span className="clause-badge not-found">Not Found</span>
              )}
            </div>

            {expandedClauses[index] && (
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
                    <button
                      className="highlight-button"
                      onClick={() => this.highlightClause(clause.text, index)}
                      disabled={highlightStatus[index] === "highlighting"}
                    >
                      {highlightStatus[index] === "highlighting"
                        ? "Highlighting..."
                        : highlightStatus[index] === "success"
                        ? "Successfully Highlighted!"
                        : highlightStatus[index] === "error"
                        ? "Highlight Failed"
                        : "Highlight in Document"}
                    </button>

                    {highlightStatus[index] === "error" && (
                      <div className="error-message">
                        {highlightErrors[index]}
                      </div>
                    )}
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
    );
  }
}
