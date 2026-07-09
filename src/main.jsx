import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ClientProvider } from "./context/ClientContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClientProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
