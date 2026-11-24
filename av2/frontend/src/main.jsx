import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UsuarioProvider } from "./UsuarioContexto.jsx";
import App from "./App.jsx";
import "./estilo.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <UsuarioProvider>
                <App />
            </UsuarioProvider>
        </BrowserRouter>
    </StrictMode>
);
