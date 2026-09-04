---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `WdConfigProvider` or `createWexDesign`. Local props take precedence over global config.

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

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput, WdSelect } from '@wex-design/ui'
import { ref } from 'vue'

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

## Component Defaults

Override default props per component. Keys may be unprefixed (`Input`, `Space`) or `Wd*` aliases.

Precedence: **component props > `componentDefaults[component]` > global `size` / `inputVariant` > built-in defaults**.

`Space` / `Flex` `size` is gap and does **not** inherit the global control `size`.

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput, WdSpace } from '@wex-design/ui'
import { ref } from 'vue'

const note = ref('Clearable')
</script>

<template>
  <WdConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <WdSpace>
      <WdButton label="Still large" />
      <WdInput v-model="note" placeholder="Input defaults to small + clearable" style="width:14rem" />
    </WdSpace>
  </WdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WdButton, WdConfigProvider, WdInput } from '@wex-design/ui'
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
import { WdButton, WdConfigProvider, WdDialog, WdSelect } from '@wex-design/ui'
import { ref } from 'vue'

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
      <p style="margin:0">
        Overlay mount target is provided by ConfigProvider.
      </p>
    </WdDialog>
  </WdConfigProvider>
</template>
```

## App-level plugin

```ts
import WexDesign, { createWexDesign, enUS } from '@wex-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wex-design/ui/styles.css'

// Option A: default export
createApp(App).use(WexDesign, { locale: enUS }).mount('#app')

// Option B: factory
createApp(App)
  .use(
    createWexDesign({
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

By default **all components are registered globally** (use `<WdButton>` in templates). Pass `components: false` for config-only, or pass a component array for partial registration.

## Reading config

```ts
import { useWdConfig } from '@wex-design/ui'

const config = useWdConfig()
```

Precedence: **component props > `WdConfigProvider` > `createWexDesign()` > built-in defaults**.

## Theme and motion

Theme and motion APIs are also exported from `@wex-design/ui` and can be used alongside ConfigProvider:

```ts
import { useMotion, useTheme } from '@wex-design/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Child tree. |
