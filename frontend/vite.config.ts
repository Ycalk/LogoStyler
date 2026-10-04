import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        // Алиас `@` → src/ (тот же, что в tsconfig.app.json). Пакеты вида @base-ui не затрагивает.
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
