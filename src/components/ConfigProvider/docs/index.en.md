---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `MConfigProvider` or `createMoryaUI`. Local props take precedence over global config.

## Capabilities

| Capability | Description |
| --- | --- |
| `appendTo` | Default Teleport target for overlays; defaults to `body` |
| `size` | Default size for form controls |
| `density` | Global content density: `compact` / `comfortable` / `spacious` |
| `inputVariant` | Default input style: `outlined` / `filled` |
| `zIndex` | Base overlay z-index |
| `locale` | Strings for confirm / empty / loading / placeholder, etc. Pass built-in packs `zhCN` / `enUS` |
| `componentDefaults` | Per-component default props (e.g. `Input.size`, `Dialog.transition`). Local props win |
| `motion` | Enter/exit presets by overlay role (`dialog` / `drawer` / `popup` / `toast` / `tooltip` / `overlay`) |
| `respectReducedMotion` | Deprecated. Component motion follows `useMotion` / `data-m-motion` only. |

## Size

```vue preview src="./demos/Size.en.vue"
```

## Component Defaults

Override default props per component. Keys may be unprefixed (`Input`, `Space`) or `M*` aliases.

Precedence: **component props > `componentDefaults[component]` > global `size` / `inputVariant` > built-in defaults**.

`Space` / `Flex` `size` is gap and does **not** inherit the global control `size`.

```vue preview src="./demos/ComponentDefaults.en.vue"
```

## Density

```vue preview src="./demos/Density.vue"
```

## Input Variant

```vue preview src="./demos/InputVariant.en.vue"
```

## App-level plugin

```ts
import MoryaUI, { createMoryaUI, enUS } from 'morya-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'morya-ui/styles.css'

// Option A: default export
createApp(App).use(MoryaUI, { locale: enUS }).mount('#app')

// Option B: factory
createApp(App)
  .use(
    createMoryaUI({
      appendTo: 'body',
      size: 'small',
      density: 'comfortable',
      zIndex: 1100,
      locale: enUS,
      motion: { transitions: { popup: 'slide-up', dialog: 'zoom' } },
      componentDefaults: {
        Space: { size: 'small' },
        Input: { clearable: true },
        Select: { transition: 'fade' },
      },
    }),
  )
  .mount('#app')
```

By default **all components are registered globally** (use `<MButton>` in templates). Pass `components: false` for config-only, or pass a component array for partial registration.

## Reading config

```ts
import { useMConfig } from 'morya-ui'

const config = useMConfig()
```

Precedence: **component props > `MConfigProvider` > `createMoryaUI()` > built-in defaults**.

## Theme and motion

Intensity and enter/exit presets are separate layers:

- **Intensity**: `useMotion()` → `full` / `reduced` / `none` (writes `data-m-motion`)
- **Shape**: `motion.transitions[role]` / `componentDefaults.*.transition` / component `transition` prop

```ts
import { createMoryaUI, registerMotionPreset, useMotion, useTheme } from 'morya-ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'

app.use(createMoryaUI({
  respectReducedMotion: false, // docs demos may ignore OS reduced motion
  motion: { transitions: { popup: 'slide-up' } },
}))

registerMotionPreset('brand', { name: 'm-brand' })
```

Full preset list and demos: [Motion](/docs/motion). Light/dark and density: [Theme](/docs/theme).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `config` | `Partial<MGlobalConfig>` | — | Full config object (same as the shorthands below). |
| `appendTo` | `string \| HTMLElement` | `'body'` | Default Teleport target for overlays. |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | Default form control size. |
| `inputVariant` | `'outlined' \| 'filled'` | — | Default input surface. |
| `zIndex` | `number` | — | Base overlay z-index. |
| `density` | `'compact' \| 'comfortable' \| 'spacious'` | — | Global content density. |
| `theme` | `'light' \| 'dark' \| 'system'` | — | Color theme; `system` follows OS. |
| `locale` | `MLocale` | — | Copy pack (`zhCN` / `enUS`). |
| `componentDefaults` | `Record<string, object>` | — | Per-component default props (including `transition`). |
| `motion` | `{ transitions?: Partial<Record<role, string>> }` | — | Enter/exit presets by overlay role. |
| `respectReducedMotion` | `boolean` | `true` | Deprecated. Component motion does not read OS `prefers-reduced-motion`. |
| `globalDensity` | `boolean` | `true` | Also write density / theme to `documentElement`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through; see [Styling & attrs](/docs/attrs). |

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Child tree. |
