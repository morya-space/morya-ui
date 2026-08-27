---
title: InputNumber
category: 02 / FORM
description: Number input with optional steppers, min/max bounds, and sizes.
---

# InputNumber

Number input. Can show increment and decrement buttons, and constrain values with `min` / `max` / `step`.

## Import

```ts
import { WiInputNumber } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(1)
</script>

<template>
  <WiInputNumber v-model="value" label="Quantity" :min="0" :max="99" />
</template>
```

## Buttons

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <WiInputNumber v-model="value" label="With buttons" show-buttons :min="0" :max="20" :step="1" />
</template>
```

## Precision & placement

`precision` rounds to a number of decimal places. `button-placement="right"` puts both buttons on the right. `clearable` shows a clear control.

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(1.25)
</script>

<template>
  <WiInputNumber v-model="value" show-buttons button-placement="right" :precision="2" :step="0.25" clearable />
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
| `precision` | `number` | — | Decimal places. |
| `showButtons` | `boolean` | `false` | Show increment and decrement buttons. |
| `buttonPlacement` | `'both' \| 'right'` | `'both'` | Button placement. |
| `clearable` | `boolean` | `false` | Show a clear control. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `fluid` | `boolean` | `false` | Full width. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | Value changed. |
