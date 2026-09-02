import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const appDir = fileURLToPath(new URL('.', import.meta.url))
const uiRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        // dist/styles.css 在未完整 build 时几乎为空；开发态直接走源码样式聚合
        find: '@well-insight/ui/styles.css',
        replacement: fileURLToPath(new URL('../../src/styles/index.css', import.meta.url)),
      },
      {
        find: '@well-insight/ui',
        replacement: fileURLToPath(new URL('../../src', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  server: {
    port: 5174,
    open: true,
    fs: {
      allow: [appDir, uiRoot],
    },
  },
})
