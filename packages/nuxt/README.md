# @roost-design/nuxt

Nuxt 3 module for [@roost-design/ui](https://www.npmjs.com/package/@roost-design/ui).

## Features

- Imports `@roost-design/ui/styles.css`
- Transpiles `@roost-design/ui` for SSR
- Client plugin: `createRoostDesign({ components: false })` for toast/message overlay context

Component auto-import remains via `RoostDesignResolver` + `unplugin-vue-components` (see [SSR guide](https://roost-design.github.io/roost-design-ui/docs/ssr)).

## Setup

```bash
pnpm add @roost-design/ui @roost-design/nuxt
pnpm add -D unplugin-vue-components
```

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/vite'
import { RoostDesignResolver } from '@roost-design/ui/resolver'

export default defineNuxtConfig({
  modules: ['@roost-design/nuxt'],
  RoostDesign: {
    css: true,
    transpile: true,
  },
  vite: {
    plugins: [
      Components({
        resolvers: [RoostDesignResolver()],
      }),
    ],
  },
})
```

Wrap your app with `RdConfigProvider` in `app.vue` for theme and global defaults.

## Options (`RoostDesign`)

| Option | Default | Description |
| --- | --- | --- |
| `css` | `true` | Import global component styles |
| `transpile` | `true` | Transpile the UI package for SSR |
