---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `WiConfigProvider` or `createWellInsight`. Local props take precedence over global config.

## Capabilities

| Capability | Description |
| --- | --- |
| `appendTo` | Default Teleport target for overlays; defaults to `body` |
| `size` | Default size for form controls |
| `density` | Global content density: `compact` / `comfortable` / `spacious` |
| `inputVariant` | Default input style: `outlined` / `filled` |
| `zIndex` | Base overlay z-index |
| `locale` | Strings for confirm / empty / loading / placeholder, etc. Pass built-in packs `zhCN` / `enUS` |

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiConfigProvider, WiButton, WiInput, WiSelect } from '@well-insight/ui'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WiConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiButton label="Inherit small" />
      <WiInput placeholder="Inherit small" style="width:10rem" />
      <WiSelect v-model="city" :options="options" placeholder="Inherit small" style="width:10rem" />
      <WiButton label="Override to large" size="large" />
    </div>
  </WiConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WiConfigProvider, WiButton, WiInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WiConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WiButton label="compact" />
        <WiInput placeholder="compact" style="width:10rem" />
      </div>
    </WiConfigProvider>
    <WiConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WiButton label="spacious" />
        <WiInput placeholder="spacious" style="width:10rem" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiConfigProvider, WiButton, WiSelect, WiDialog } from '@well-insight/ui'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WiConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiSelect v-model="city" :options="options" placeholder="filled input" style="width:12rem" />
      <WiButton label="Open dialog" @click="visible = true" />
    </div>
    <WiDialog v-model="visible" title="Inherits appendTo" style="width: 24rem">
      <p style="margin:0">Overlay mount target is provided by ConfigProvider.</p>
    </WiDialog>
  </WiConfigProvider>
</template>
```

## App-level plugin

```ts
import { createApp } from 'vue'
import WellInsight, { createWellInsight, enUS } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

// Option A: default export
createApp(App).use(WellInsight, { locale: enUS }).mount('#app')

// Option B: factory
createApp(App)
  .use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      density: 'comfortable',
      zIndex: 1100,
      locale: enUS,
    }),
  )
  .mount('#app')
```

By default **all components are registered globally** (use `<WiButton>` in templates). Pass `components: false` for config-only, or pass a component array for partial registration.

## Reading config

```ts
import { useWiConfig } from '@well-insight/ui'

const config = useWiConfig()
```

Precedence: **component props > `WiConfigProvider` > `createWellInsight()` > built-in defaults**.

## Theme and motion

Theme and motion APIs are also exported from `@well-insight/ui` and can be used alongside ConfigProvider:

```ts
import { useTheme, useMotion } from '@well-insight/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```
