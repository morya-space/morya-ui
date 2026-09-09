# @morya-space/nuxt

Nuxt 3 module for [morya-ui](https://www.npmjs.com/package/morya-ui).

## Features

- Imports `morya-ui/styles.css`
- Transpiles `morya-ui` for SSR
- Client plugin: `createMoryaUI({ components: false })` for toast/message overlay context

Component auto-import remains via `MoryaUIResolver` + `unplugin-vue-components` (see [SSR guide](https://morya-ui.github.io/morya-ui/docs/ssr)).

## Setup

```bash
pnpm add morya-ui @morya-space/nuxt
pnpm add -D unplugin-vue-components
```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { MoryaUIResolver } from 'morya-ui/resolver'

export default defineNuxtConfig({
  modules: ['@morya-space/nuxt'],
  moryaUI: {
    css: true,
    transpile: true,
  },
  vite: {
    plugins: [
      Components({
        resolvers: [MoryaUIResolver()],
      }),
    ],
  },
})
```

Wrap your app with `MConfigProvider` in `app.vue` for theme and global defaults.

## Options (`MoryaUI`)

| Option | Default | Description |
| --- | --- | --- |
| `css` | `true` | Import global component styles |
| `transpile` | `true` | Transpile the UI package for SSR |
