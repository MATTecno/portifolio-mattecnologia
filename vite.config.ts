import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        recruiters: resolve(import.meta.dirname, 'recrutadores/index.html'),
        projectInvites: resolve(import.meta.dirname, 'projetos/convites/index.html'),
        projectInventory: resolve(import.meta.dirname, 'projetos/estoque/index.html'),
        projectSignature: resolve(import.meta.dirname, 'projetos/zd-signature-input/index.html'),
        projectPos: resolve(import.meta.dirname, 'projetos/pdv/index.html'),
        privacy: resolve(import.meta.dirname, 'privacidade/index.html'),
      },
    },
  },
})
