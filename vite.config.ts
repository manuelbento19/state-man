/// <reference types="vite/client" />
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

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
    dts({
      insertTypesEntry: true,
      include: ["./src/**/*.ts"]
    })
  ],
  test: {
    environment: "jsdom"
  },
  resolve: {
    alias: {
      "@base": path.resolve(__dirname,'./src/')
    }
  }
})