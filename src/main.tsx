import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log(`main.tsx::mode: ${import.meta.env.MODE}`);

async function enableMocking() {
  if (import.meta.env.MODE === "development") {
    const { worker } = await import("./mock_api/browser.ts");

    return worker.start();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
