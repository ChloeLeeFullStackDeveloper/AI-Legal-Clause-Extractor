export interface Clause {
  title: string;
  text: string;
  summary: string;
}

export interface ClauseExtractionResult {
  clauses: Clause[];
}
