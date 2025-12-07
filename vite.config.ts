/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    {
      name: 'serve-sqlite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/cc-cedict.sqlite') {
            const filePath = path.resolve(__dirname, 'cc-cedict.sqlite');
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Disposition', 'attachment; filename="cc-cedict.sqlite"');
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
    }
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
