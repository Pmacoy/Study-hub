import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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