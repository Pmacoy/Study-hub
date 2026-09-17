import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Study Hub',
        short_name: 'Study Hub',
        description: 'Plataforma de Estudos DevOps',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  server: {
    watch: {
      // H:\ parece ser uma drive de rede/cloud mapeada — o watcher nativo
      // do chokidar não deteta escritas nela de forma fiável, por isso o
      // HMR nunca disparava (confirmado: escritas no disco não reflectiam
      // no browser mesmo depois de reload). Polling força o Vite a verificar
      // os ficheiros periodicamente em vez de confiar em eventos do SO.
      usePolling: true,
      interval: 300,
    },
  },
})