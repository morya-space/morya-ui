# @wise-kit/nuxt

Nuxt 3 module for [@wise-kit/ui](https://www.npmjs.com/package/@wise-kit/ui).

## Features

- Imports `@wise-kit/ui/styles.css`
- Transpiles `@wise-kit/ui` for SSR
- Client plugin: `createWiseKit({ components: false })` for toast/message overlay context

Component auto-import remains via `WiseKitResolver` + `unplugin-vue-components` (see [SSR guide](https://wise-kit.github.io/wise-kit-ui/docs/ssr)).

## Setup

```bash
pnpm add @wise-kit/ui @wise-kit/nuxt
pnpm add -D unplugin-vue-components
```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WiseKitResolver } from '@wise-kit/ui/resolver'

export default defineNuxtConfig({
  modules: ['@wise-kit/nuxt'],
  WiseKit: {
    css: true,
    transpile: true,
  },
  vite: {
    plugins: [
      Components({
        resolvers: [WiseKitResolver()],
      }),
    ],
  },
})
```

Wrap your app with `WkConfigProvider` in `app.vue` for theme and global defaults.

## Options (`WiseKit`)

| Option | Default | Description |
| --- | --- | --- |
| `css` | `true` | Import global component styles |
| `transpile` | `true` | Transpile the UI package for SSR |
