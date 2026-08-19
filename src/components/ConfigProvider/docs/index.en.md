---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `WdConfigProvider` or `createWellInsight`. Local props take precedence over global config.

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
import { WdConfigProvider, WdButton, WdInput, WdSelect } from '@well-insight/ui'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WdConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdButton label="Inherit small" />
      <WdInput placeholder="Inherit small" style="width:10rem" />
      <WdSelect v-model="city" :options="options" placeholder="Inherit small" style="width:10rem" />
      <WdButton label="Override to large" size="large" />
    </div>
  </WdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WdConfigProvider, WdButton, WdInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WdConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WdButton label="compact" />
        <WdInput placeholder="compact" style="width:10rem" />
      </div>
    </WdConfigProvider>
    <WdConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WdButton label="spacious" />
        <WdInput placeholder="spacious" style="width:10rem" />
      </div>
    </WdConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdConfigProvider, WdButton, WdSelect, WdDialog } from '@well-insight/ui'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WdConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WdSelect v-model="city" :options="options" placeholder="filled input" style="width:12rem" />
      <WdButton label="Open dialog" @click="visible = true" />
    </div>
    <WdDialog v-model="visible" title="Inherits appendTo" style="width: 24rem">
      <p style="margin:0">Overlay mount target is provided by ConfigProvider.</p>
    </WdDialog>
  </WdConfigProvider>
</template>
```

## App-level plugin

```ts
import { createApp } from 'vue'
import { createWellInsight, enUS } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

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

## Reading config

```ts
import { useWdConfig } from '@well-insight/ui'

const config = useWdConfig()
```

Precedence: **component props > `WdConfigProvider` > `createWellInsight()` > built-in defaults**.

## Theme and motion

Theme and motion APIs are also exported from `@well-insight/ui` and can be used alongside ConfigProvider:

```ts
import { useTheme, useMotion } from '@well-insight/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```
