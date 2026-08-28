import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    conditions: ['node'],
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**'],
    environment: 'happy-dom',
    clearMocks: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: ['vue', '@vue/test-utils'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**/*.vue', 'src/**/*.ts'],
      exclude: ['src/env.d.ts'],
    },
  },
})
