import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const visualRoot = fileURLToPath(new URL('.', import.meta.url))
const srcRoot = fileURLToPath(new URL('../../src', import.meta.url))

export default defineConfig({
  root: visualRoot,
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^morya-ui$/,
        replacement: srcRoot,
      },
      {
        find: /^morya-ui\/(.*)$/,
        replacement: `${srcRoot}/$1`,
      },
    ],
  },
  server: {
    port: 5199,
    strictPort: true,
  },
  preview: {
    port: 5199,
    strictPort: true,
  },
})
