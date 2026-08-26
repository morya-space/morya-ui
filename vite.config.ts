import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const root = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const componentFolders = readdirSync(root('./src/components')).filter((name) =>
  statSync(root(`./src/components/${name}`)).isDirectory(),
).sort()

function toSlug(folder: string) {
  return folder
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

const onDemand = componentFolders.map((folder) => ({
  slug: toSlug(folder),
  folder,
}))

const onDemandEntries = Object.fromEntries(
  onDemand.map(({ slug, folder }) => [`${slug}/index`, root(`./src/components/${folder}/index.ts`)]),
)

function keepStyleSideEffect(): Plugin {
  return {
    name: 'wi-keep-style-side-effect',
    enforce: 'pre',
    resolveId(id) {
      if (id === './style' || id === './style.ts') {
        return { id: './style.js', external: true }
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const isOnDemand = mode === 'on-demand'

  return {
    plugins: [
      vue(),
      ...(isOnDemand ? [keepStyleSideEffect()] : []),
      ...isOnDemand
        ? []
        : [
            dts({
              processor: 'vue',
              include: ['src'],
              exclude: ['src/**/*.test.ts', 'src/docs/**', 'src/styles/full.ts', 'src/**/style.ts'],
              entryRoot: 'src',
              tsconfigPath: root('./tsconfig.build.json'),
              insertTypesEntry: true,
              staticImport: true,
              cleanVueFileName: false,
            }),
          ],
    ],
    build: {
      emptyOutDir: !isOnDemand,
      cssCodeSplit: false,
      lib: {
        entry: isOnDemand
          ? onDemandEntries
          : {
              index: root('./src/index.ts'),
              styles: root('./src/styles/full.ts'),
              resolver: root('./src/resolver.ts'),
            },
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`,
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          assetFileNames: 'styles.css',
        },
      },
    },
  }
})
