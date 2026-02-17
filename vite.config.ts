import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Needed to add the base url for github pages to work
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/jsbudgetrxdb/",
});
