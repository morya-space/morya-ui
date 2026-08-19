---
title: InputNumber
category: 02 / FORM
description: Number input with optional steppers, min/max bounds, and sizes.
---

# InputNumber

Number input. Can show increment and decrement buttons, and constrain values with `min` / `max` / `step`.

## Import

```ts
import { WdInputNumber } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInputNumber } from '@well-insight/ui'

const value = ref(1)
</script>

<template>
  <WdInputNumber v-model="value" label="Quantity" :min="0" :max="99" />
</template>
```

## Buttons

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInputNumber } from '@well-insight/ui'

const value = ref(3)
</script>

<template>
  <WdInputNumber v-model="value" label="With buttons" show-buttons :min="0" :max="20" :step="1" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | Bound value. |
| `label` | `string` | — | Label text. |
| `min` | `number` | — | Minimum value. |
| `max` | `number` | — | Maximum value. |
| `step` | `number` | `1` | Step. |
| `showButtons` | `boolean` | `false` | Show increment and decrement buttons. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `fluid` | `boolean` | `false` | Full width. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | Value changed. |
