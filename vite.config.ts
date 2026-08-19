import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: 'vue',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/docs/**'],
      entryRoot: 'src',
      tsconfigPath: fileURLToPath(new URL('./tsconfig.build.json', import.meta.url)),
      insertTypesEntry: true,
      staticImport: true,
      cleanVueFileName: false,
    }),
  ],
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles.css'
          }
          return assetInfo.name ?? 'asset-[name][extname]'
        },
      },
    },
  },
})
