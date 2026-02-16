import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import AlertProvider from "./providers/AlertProvider";
import AlertDialog from "./components/AlertDialog";
import { DatabaseProvider } from "./providers/DatabaseProvider.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DatabaseProvider>
      <AlertProvider AlertComponent={AlertDialog}>
        <App />
      </AlertProvider>
    </DatabaseProvider>
  </StrictMode>,
);
