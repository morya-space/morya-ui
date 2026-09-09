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

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <MButton label="Inherit small" />
      <MInput placeholder="Inherit small" style="width:10rem" />
      <MSelect v-model="city" :options="options" placeholder="Inherit small" style="width:10rem" />
      <MButton label="Override to large" size="large" />
    </div>
  </MConfigProvider>
</template>
```

## Component Defaults

Override default props per component. Keys may be unprefixed (`Input`, `Space`) or `M*` aliases.

Precedence: **component props > `componentDefaults[component]` > global `size` / `inputVariant` > built-in defaults**.

`Space` / `Flex` `size` is gap and does **not** inherit the global control `size`.

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSpace } from 'morya-ui'
import { ref } from 'vue'

const note = ref('Clearable')
</script>

<template>
  <MConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <MSpace>
      <MButton label="Still large" />
      <MInput v-model="note" placeholder="Input defaults to small + clearable" style="width:14rem" />
    </MSpace>
  </MConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MInput } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <MConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <MButton label="compact" />
        <MInput placeholder="compact" style="width:10rem" />
      </div>
    </MConfigProvider>
    <MConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <MButton label="spacious" />
        <MInput placeholder="spacious" style="width:10rem" />
      </div>
    </MConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <MSelect v-model="city" :options="options" placeholder="filled input" style="width:12rem" />
      <MButton label="Open dialog" @click="visible = true" />
    </div>
    <MDialog v-model="visible" title="Inherits appendTo" style="width: 24rem">
      <p style="margin:0">
        Overlay mount target is provided by ConfigProvider.
      </p>
    </MDialog>
  </MConfigProvider>
</template>
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
