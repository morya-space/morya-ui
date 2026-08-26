---
title: InputColor
category: 02 / FORM
description: Color picker with a palette and hexadecimal text input.
---

# InputColor

Edit hex colors with the native color picker and a text field.

## Import

```ts
import { WiInputColor } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputColor } from '@well-insight/ui'

const color = ref('#2563eb')
</script>

<template>
  <WiInputColor v-model="color" />
</template>
```

## Swatches

`swatches` provides a row of preset colors.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputColor } from '@well-insight/ui'

const color = ref('#2563eb')
</script>

<template>
  <WiInputColor v-model="color" :swatches="['#2563eb', '#16a34a', '#dc2626']" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#000000'` | Hexadecimal color. |
| `swatches` | `string[]` | — | Preset color chips. |
| `disabled` | `boolean` | `false` | Disabled. |
| `id` | `string` | — | Color input id. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Color changed. |
