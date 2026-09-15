import {
  defineConfig,
  presetWind3,
  transformerVariantGroup,
} from 'unocss'

// UnoCSS for component docs demo SFCs under src/components/*/docs/demos.
// Docs chrome keeps its own CSS; demos prefer utilities over inline styles.
export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerVariantGroup()],
  content: {
    filesystem: [
      '../src/components/*/docs/demos/**/*.{vue,md}',
      './src/docs/guide/demos/**/*.{vue,md}',
    ],
  },
})
