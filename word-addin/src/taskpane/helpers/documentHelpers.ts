export async function getDocumentText(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    Word.run(async context => {
      try {
        const body = context.document.body;
        body.load("text");
        await context.sync();
        
        resolve(body.text);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function highlightTextInDocument(text: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Word.run(async context => {
      try {
        // Normalize the text for searching - remove extra whitespace
        const normalizedText = text.replace(/\s+/g, " ").trim();
        
        // Search for the text in the document
        const searchResults = context.document.body.search(normalizedText, {
          matchCase: false,
          matchWholeWord: false,
          matchWildcards: false
        });
        
        searchResults.load("length");
        await context.sync();
        
        // If no matches found, let the user know
        if (searchResults.items.length === 0) {
          reject(new Error("Could not find the exact clause text in the document"));
          return;
        }
        
        // Highlight each instance of the text
        searchResults.items.forEach(range => {
          range.font.highlightColor = "#FFFF00"; // Yellow highlight
        });
        
        await context.sync();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}