import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./taskpane.css";

// Initialize Office
Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    const container = document.getElementById("container");
    
    // Add a null check before creating root
    if (container) {
      const root = createRoot(container);
      root.render(<App />);
    } else {
      console.error("Could not find container element");
    }
  }
});