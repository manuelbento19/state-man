/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: ["react","react-dom"],
      output: {
        globals: {
          react: "React",
        },
        entryFileNames: '[name].js'
      }
    },
  },
  plugins: [
    react(),
  ],
})