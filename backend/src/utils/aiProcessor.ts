import OpenAI from 'openai';
import { config } from '../config/env';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export interface Clause {
  title: string;
  text: string;
  summary: string;
}

export interface ClauseExtractionResult {
  clauses: Clause[];
}

/**
 * Extracts legal clauses from document text using OpenAI API
 * @param text The full text of the legal document
 * @returns Object containing an array of extracted clauses
 */
export async function extractClauses(text: string): Promise<ClauseExtractionResult> {
  try {
    // Create prompt for AI
    const prompt = `
      Extract the following clauses from this legal document:
      1. Termination
      2. Confidentiality
      3. Governing Law
      4. Dispute Resolution
      5. Intellectual Property
      6. Liability
      7. Force Majeure
      
      For each clause, provide:
      - Title of the clause
      - Full text of the clause (exact text from the document)
      - A brief summary (1-2 sentences)
      
      Format your response as a JSON object with the following structure:
      {
        "clauses": [
          {
            "title": "Clause Title",
            "text": "Full clause text",
            "summary": "Brief summary"
          }
        ]
      }
      
      If a clause is not found, include it with empty text and summary.
      
      Here is the document text:
      ${text.substring(0, 8000)}
    `;

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 2000,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.text?.trim() || '';
    
    try {
      const result = JSON.parse(responseText) as ClauseExtractionResult;
      return result;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', responseText);
    
      return {
        clauses: [
          {
            title: "Error",
            text: "Failed to extract clauses. The AI response could not be parsed correctly.",
            summary: "An error occurred during clause extraction."
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error extracting clauses with OpenAI:', error);
    throw new Error('Failed to process document with AI: ' + (error as Error).message);
  }
}