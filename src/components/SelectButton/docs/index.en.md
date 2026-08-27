---
title: SelectButton
category: 02 / FORM
description: Single or multiple selection presented as a button group.
---

# SelectButton

Present options as a button group, with single and multiple selection.

## Import

```ts
import { WiSelectButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiSelectButton } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('center')
const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
</script>

<template>
  <WiSelectButton v-model="value" :options="options" />
</template>
```

## Multiple

```vue preview
<script setup lang="ts">
import { WiSelectButton } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(['left'])
const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
</script>

<template>
  <WiSelectButton v-model="value" :options="options" multiple />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| Array` | — | Bound value. |
| `options` | `{ label, value, disabled? }[]` | — | Option list. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `disabled` | `boolean` | `false` | Disable the entire group. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | Same as `modelValue` | Emitted when the value changes. |
