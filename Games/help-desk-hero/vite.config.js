import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds ONE self-contained index.html in /dist (all JS, CSS and SVG inlined)
// so the game can run offline, from a USB stick, or on a school LMS.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist', assetsInlineLimit: 100000000 },
});
