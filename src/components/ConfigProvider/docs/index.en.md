---
title: ConfigProvider
category: 00 / GUIDE
description: Global configuration entry. Unifies app-level defaults such as overlay mount, size, density, and locale strings.
---

# ConfigProvider

Provide global defaults for the component tree via `WkConfigProvider` or `createWiseKit`. Local props take precedence over global config.

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
import { WkButton, WkConfigProvider, WkInput, WkSelect } from '@wise-kit/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WkConfigProvider size="small">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkButton label="Inherit small" />
      <WkInput placeholder="Inherit small" style="width:10rem" />
      <WkSelect v-model="city" :options="options" placeholder="Inherit small" style="width:10rem" />
      <WkButton label="Override to large" size="large" />
    </div>
  </WkConfigProvider>
</template>
```

## Component Defaults

Override default props per component. Keys may be unprefixed (`Input`, `Space`) or `Wk*` aliases.

Precedence: **component props > `componentDefaults[component]` > global `size` / `inputVariant` > built-in defaults**.

`Space` / `Flex` `size` is gap and does **not** inherit the global control `size`.

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkInput, WkSpace } from '@wise-kit/ui'
import { ref } from 'vue'

const note = ref('Clearable')
</script>

<template>
  <WkConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <WkSpace>
      <WkButton label="Still large" />
      <WkInput v-model="note" placeholder="Input defaults to small + clearable" style="width:14rem" />
    </WkSpace>
  </WkConfigProvider>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkInput } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem">
    <WkConfigProvider density="compact">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WkButton label="compact" />
        <WkInput placeholder="compact" style="width:10rem" />
      </div>
    </WkConfigProvider>
    <WkConfigProvider density="spacious">
      <div style="display:flex;gap:0.75rem;align-items:center">
        <WkButton label="spacious" />
        <WkInput placeholder="spacious" style="width:10rem" />
      </div>
    </WkConfigProvider>
  </div>
</template>
```

## Input Variant

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkDialog, WkSelect } from '@wise-kit/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WkConfigProvider input-variant="filled" append-to="body">
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkSelect v-model="city" :options="options" placeholder="filled input" style="width:12rem" />
      <WkButton label="Open dialog" @click="visible = true" />
    </div>
    <WkDialog v-model="visible" title="Inherits appendTo" style="width: 24rem">
      <p style="margin:0">
        Overlay mount target is provided by ConfigProvider.
      </p>
    </WkDialog>
  </WkConfigProvider>
</template>
```

## App-level plugin

```ts
import WiseKit, { createWiseKit, enUS } from '@wise-kit/ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@wise-kit/ui/styles.css'

// Option A: default export
createApp(App).use(WiseKit, { locale: enUS }).mount('#app')

// Option B: factory
createApp(App)
  .use(
    createWiseKit({
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

By default **all components are registered globally** (use `<WkButton>` in templates). Pass `components: false` for config-only, or pass a component array for partial registration.

## Reading config

```ts
import { useWkConfig } from '@wise-kit/ui'

const config = useWkConfig()
```

Precedence: **component props > `WkConfigProvider` > `createWiseKit()` > built-in defaults**.

## Theme and motion

Theme and motion APIs are also exported from `@wise-kit/ui` and can be used alongside ConfigProvider:

```ts
import { useMotion, useTheme } from '@wise-kit/ui'

const { setTheme, toggleTheme } = useTheme()
const { setMotion } = useMotion() // 'full' | 'reduced' | 'none'
```

## Events

No custom events.

## Slots

| Slot | Description |
| --- | --- |
| `default` | Child tree. |
