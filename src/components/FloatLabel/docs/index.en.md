---
title: FloatLabel
category: 02 / FORM
description: Floating label wrapper. The label floats up when focused or when the field has a value.
---

# FloatLabel

Wraps an input. The label floats up on focus or when the field has content. Nested inputs should set a non-empty `placeholder` (such as a space) so `:placeholder-shown` works as expected.

## Import

```ts
import { WiFloatLabel, WiInput } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiFloatLabel, WiInput } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WiFloatLabel label="Username">
    <WiInput v-model="value" placeholder=" " />
  </WiFloatLabel>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label text; the `label` slot can also be used. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Input control. |
| `label` | Custom label content. |
