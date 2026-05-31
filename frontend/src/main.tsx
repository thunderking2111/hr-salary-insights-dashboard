import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Scaffold entry only — first UI arrives with the first TDD green commit.
createRoot(rootElement).render(null);
