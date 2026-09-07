---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `RdConfigProvider` or `createRoostDesign`. Local props take precedence over global config.

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
import { RdButton, RdConfigProvider, RdInput, RdSelect } from '@roost-design/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <RdConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <RdButton label="Inherit small" />
      <RdInput placeholder="Inherit small" style="width:10rem" />
      <RdSelect v-model="city" :options="options" placeholder="Inherit small" style="width:10rem" />
      <RdButton label="Override to large" size="large" />
    </div>
  </RdConfigProvider>
</template>
```

## Component Defaults

Override default props per component. Keys may be unprefixed (`Input`, `Space`) or `Rd*` aliases.

Precedence: **component props > `componentDefaults[component]` > global `size` / `inputVariant` > built-in defaults**.

`Space` / `Flex` `size` is gap and does **not** inherit the global control `size`.

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput, RdSpace } from '@roost-design/ui'
import { ref } from 'vue'

const note = ref('Clearable')
</script>

<template>
  <RdConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <RdSpace>
      <RdButton label="Still large" />
      <RdInput v-model="note" placeholder="Input defaults to small + clearable" style="width:14rem" />
    </RdSpace>
  </RdConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <RdConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <RdButton label="compact" />
        <RdInput placeholder="compact" style="width:10rem" />
      </div>
    </RdConfigProvider>
    <RdConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <RdButton label="spacious" />
        <RdInput placeholder="spacious" style="width:10rem" />
      </div>
    </RdConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdDialog, RdSelect } from '@roost-design/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <RdConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <RdSelect v-model="city" :options="options" placeholder="filled input" style="width:12rem" />
      <RdButton label="Open dialog" @click="visible = true" />
    </div>
    <RdDialog v-model="visible" title="Inherits appendTo" style="width: 24rem">
      <p style="margin:0">
        Overlay mount target is provided by ConfigProvider.
      </p>
    </RdDialog>
  </RdConfigProvider>
</template>
```

## App-level plugin

```ts
import RoostDesign, { createRoostDesign, enUS } from '@roost-design/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@roost-design/ui/styles.css'

// Option A: default export
createApp(App).use(RoostDesign, { locale: enUS }).mount('#app')

// Option B: factory
createApp(App)
  .use(
    createRoostDesign({
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

By default **all components are registered globally** (use `<RdButton>` in templates). Pass `components: false` for config-only, or pass a component array for partial registration.

## Reading config

```ts
import { useRdConfig } from '@roost-design/ui'

const config = useRdConfig()
```

Precedence: **component props > `RdConfigProvider` > `createRoostDesign()` > built-in defaults**.

## Theme and motion

Theme and motion APIs are also exported from `@roost-design/ui` and can be used alongside ConfigProvider:

```ts
import { useMotion, useTheme } from '@roost-design/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Child tree. |
