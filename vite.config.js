// O Vite do repo serve dois usos: `yarn dev`, que abre a Calculadora sozinha numa janela
// falsa do RoqueOS com o sistema de desenvolvimento do SDK (dev/), e `yarn test`, com o
// Vitest. No RoqueOS quem compila o app é o Vite do próprio RoqueOS: este arquivo não vai
// junto.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['test/preparar.js'],
    include: ['test/**/*.spec.js'],
  },
})
