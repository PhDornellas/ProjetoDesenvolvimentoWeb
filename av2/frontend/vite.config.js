import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O endereço do backend fica em src/util/api.js (URL_BACKEND)
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173
    }
});
