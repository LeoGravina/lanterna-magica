import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione esta seção abaixo
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/, // Regex para incluir arquivos .js e .jsx
    exclude: [],
  },
})