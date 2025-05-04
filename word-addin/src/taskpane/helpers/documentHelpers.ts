export async function getDocumentText(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    Word.run(async (context) => {
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
    Word.run(async (context) => {
      try {
        const normalizedText = text.replace(/\s+/g, " ").trim();

        const searchResults = context.document.body.search(normalizedText, {
          matchCase: false,
          matchWholeWord: false,
          matchWildcards: false,
        });

        searchResults.load("length");
        await context.sync();

        if (searchResults.items.length === 0) {
          reject(
            new Error("Could not find the exact clause text in the document")
          );
          return;
        }

        searchResults.items.forEach((range) => {
          range.font.highlightColor = "#FFFF00";
        });

        await context.sync();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}
