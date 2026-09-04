# @wex-design/nuxt

Nuxt 3 module for [@wex-design/ui](https://www.npmjs.com/package/@wex-design/ui).

## Features

- Imports `@wex-design/ui/styles.css`
- Transpiles `@wex-design/ui` for SSR
- Client plugin: `createWexDesign({ components: false })` for toast/message overlay context

Component auto-import remains via `WexDesignResolver` + `unplugin-vue-components` (see [SSR guide](https://wex-design.github.io/wex-design-ui/docs/ssr)).

## Setup

```bash
pnpm add @wex-design/ui @wex-design/nuxt
pnpm add -D unplugin-vue-components
```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WexDesignResolver } from '@wex-design/ui/resolver'

export default defineNuxtConfig({
  modules: ['@wex-design/nuxt'],
  wexDesign: {
    css: true,
    transpile: true,
  },
  vite: {
    plugins: [
      Components({
        resolvers: [WexDesignResolver()],
      }),
    ],
  },
})
```

Wrap your app with `WdConfigProvider` in `app.vue` for theme and global defaults.

## Options (`wexDesign`)

| Option | Default | Description |
| --- | --- | --- |
| `css` | `true` | Import global component styles |
| `transpile` | `true` | Transpile the UI package for SSR |
