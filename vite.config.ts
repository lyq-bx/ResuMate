import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ['pdfjs-dist', 'pdfjs-dist/legacy/build/pdf.mjs']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
