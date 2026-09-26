import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['vue', 'vuetify'],
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.esm.js' }],
  },
  build: {
    // Zeedhi publishes ESM files containing CommonJS require calls.
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        recruiters: resolve(import.meta.dirname, 'recrutadores/index.html'),
        signatureDemo: resolve(import.meta.dirname, 'demos/assinatura/index.html'),
        projectInvites: resolve(import.meta.dirname, 'projetos/convites/index.html'),
        projectInventory: resolve(import.meta.dirname, 'projetos/estoque/index.html'),
        projectSignature: resolve(import.meta.dirname, 'projetos/zd-signature-input/index.html'),
        projectBrutona: resolve(import.meta.dirname, 'projetos/brutona/index.html'),
        projectVmTravel: resolve(import.meta.dirname, 'projetos/vm-viagens/index.html'),
        projectPos: resolve(import.meta.dirname, 'projetos/pdv/index.html'),
        privacy: resolve(import.meta.dirname, 'privacidade/index.html'),
        adsLanding: resolve(import.meta.dirname, 'sistemas-sob-medida-bh/index.html'),
        bajaCampaign: resolve(import.meta.dirname, 'baja/index.html'),
      },
    },
  },
})
