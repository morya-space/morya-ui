import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    stylistic: false,
    formatters: false,
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.vite/**',
      'docs/**',
    ],
  },
  {
    rules: {
      "no-alert": "off",
      "unused-imports/no-unused-vars": "off",
      "node/prefer-global/buffer": "off",
      "antfu/no-top-level-await": "off",
      "no-console": "off",
      "node/prefer-global/process": "off",
      "regexp/no-unused-capturing-group": "off",
      "new-cap": "off",
      "vue/custom-event-name-casing": "off"
    },
  },
)
