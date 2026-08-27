---
title: ToggleButton
category: 02 / FORM
description: A button that switches between on and off labels.
---

# ToggleButton

A boolean toggle button with configurable on/off labels and icons.

## Import

```ts
import { WiToggleButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiToggleButton } from '@well-insight/ui'
import { ref } from 'vue'

const on = ref(false)
</script>

<template>
  <WiToggleButton v-model="on" on-label="On" off-label="Off" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiToggleButton } from '@well-insight/ui'
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiToggleButton v-model="a" size="small" on-label="Small" off-label="Small" />
    <WiToggleButton v-model="b" on-label="Default" off-label="Default" />
    <WiToggleButton v-model="c" size="large" on-label="Large" off-label="Large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether it is on. |
| `onLabel` / `offLabel` | `string` | `On` / `Off` | Labels. |
| `onIcon` / `offIcon` | `string` | — | Optional icon characters. |
| `size` | `WiSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the value changes. |
