import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // ✅ forces React 17+ JSX transform
      babel: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }]
        ]
      }
    }),
    tailwindcss(),
  ],
})
