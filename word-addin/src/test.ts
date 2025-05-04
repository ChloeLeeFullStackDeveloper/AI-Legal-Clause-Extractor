// A basic function to test TypeScript compilation
function greetUser(name: string): string {
  return `Hello, ${name}! Your TypeScript configuration is working.`;
}

// Export the function so it's not treated as unused code
export { greetUser };

// Log a message to confirm the file is being processed
console.log("TypeScript configuration test file loaded");