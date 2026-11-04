import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// base "./" + singlefile : le build est un unique index.html ouvrable sans serveur.
export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
});
