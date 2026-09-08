---
title: ToggleButton
category: 02 / FORM
description: A button that switches between on and off labels.
---

# ToggleButton

A boolean toggle button with configurable on/off labels and icons.

## Import

```ts
import { WkToggleButton } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkToggleButton } from '@wise-kit/ui'
import { ref } from 'vue'

const on = ref(false)
</script>

<template>
  <WkToggleButton v-model="on" on-label="On" off-label="Off" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WkToggleButton } from '@wise-kit/ui'
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WkToggleButton v-model="a" size="small" on-label="Small" off-label="Small" />
    <WkToggleButton v-model="b" on-label="Default" off-label="Default" />
    <WkToggleButton v-model="c" size="large" on-label="Large" off-label="Large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether it is on. |
| `onLabel` / `offLabel` | `string` | `On` / `Off` | Labels. |
| `onIcon` / `offIcon` | `string` | — | Optional icon characters. |
| `size` | `WkSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Button content. |
