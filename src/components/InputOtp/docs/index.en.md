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
import { ref } from 'vue'
import { WiInputOtp } from '@well-insight/ui'

const code = ref('')
</script>

<template>
  <WiInputOtp v-model="code" :length="4" integer-only />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Concatenated value. |
| `length` | `number` | `4` | Number of cells. |
| `integerOnly` | `boolean` | `false` | Digits only. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value changed. |
