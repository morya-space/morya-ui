---
title: Listbox
category: 02 / FORM
description: List-based single or multiple selection with optional filtering.
---

# Listbox

Present options as a list with single selection, multiple selection, and filtering.

## Import

```ts
import { MListbox } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MListbox } from 'morya-ui'
import { ref } from 'vue'

const value = ref('a')
const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]
</script>

<template>
  <MListbox v-model="value" :options="options" filter list-style="max-height: 12rem" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array` | — | Bound value. |
| `options` | `{ label, value, disabled? }[]` | — | Options. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `filter` | `boolean` | `false` | Show filter box. |
| `listStyle` | `string` | — | Inline styles for the list. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | same as `modelValue` | Value changed. |

## Slots

| Slot | Description |
| --- | --- |
| `option` | Option `{ option }`. |
