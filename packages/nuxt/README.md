# @well-insight/nuxt

Nuxt 3 module for [@well-insight/ui](https://www.npmjs.com/package/@well-insight/ui).

## Features

- Imports `@well-insight/ui/styles.css`
- Transpiles `@well-insight/ui` for SSR
- Client plugin: `createWellInsight({ components: false })` for toast/message overlay context

Component auto-import remains via `WellInsightResolver` + `unplugin-vue-components` (see [SSR guide](https://well-insight.github.io/well-insight-ui/docs/ssr)).

## Setup

```bash
pnpm add @well-insight/ui @well-insight/nuxt
pnpm add -D unplugin-vue-components
```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { WellInsightResolver } from '@well-insight/ui/resolver'

export default defineNuxtConfig({
  modules: ['@well-insight/nuxt'],
  wellInsight: {
    css: true,
    transpile: true,
  },
  vite: {
    plugins: [
      Components({
        resolvers: [WellInsightResolver()],
      }),
    ],
  },
})
```

Wrap your app with `WiConfigProvider` in `app.vue` for theme and global defaults.

## Options (`wellInsight`)

| Option | Default | Description |
| --- | --- | --- |
| `css` | `true` | Import global component styles |
| `transpile` | `true` | Transpile the UI package for SSR |
