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
| `componentDefaults` | Per-component default props (e.g. `Input.size`, `Space.size`). Local props win |

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
      componentDefaults: {
        Space: { size: 'small' },
        Input: { clearable: true },
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

Theme and motion APIs are also exported from `morya-ui` and can be used alongside ConfigProvider:

```ts
import { useMotion, useTheme } from 'morya-ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Child tree. |
