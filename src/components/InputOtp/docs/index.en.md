---
title: InputOtp
category: 02 / FORM
description: Multi-cell single-character input for verification codes.
---

# InputOtp

Split a string across multiple single-character inputs.

## Import

```ts
import { WiInputOtp } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiInputOtp } from '@well-insight/ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <WiInputOtp v-model="code" :length="4" integer-only />
</template>
```

## Mask & size

`mask` renders password-style cells. `size` / `gap` control size and spacing.

```vue preview
<script setup lang="ts">
import { WiInputOtp } from '@well-insight/ui'
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <WiInputOtp v-model="code" :length="4" mask size="large" :gap="8" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Concatenated value. |
| `length` | `number` | `4` | Number of cells. |
| `integerOnly` | `boolean` | `false` | Digits only. |
| `mask` | `boolean` | `false` | Password mask. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `gap` | `string \| number` | — | Cell gap; a number is pixels. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value changed. |

## Slots

No slots.
