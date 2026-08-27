---
title: OrderList
category: 06 / DATA
description: Reorder a list with drag-and-drop and up/down buttons.
---

# OrderList

Reorder with a drag handle (native HTML5 DnD, no external library). Up and down buttons remain as a keyboard-friendly fallback.

## Import

```ts
import { WiOrderList } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiOrderList } from '@well-insight/ui'
import { ref } from 'vue'

const items = ref(['Design', 'Development', 'Testing', 'Release'])
</script>

<template>
  <WiOrderList v-model="items" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `unknown[]` | `[]` | List data. |
| `dataKey` | `string` | — | Unique key for object items. |
| `listStyle` | `string \| object` | — | List styles. |
| `dragdrop` | `boolean` | `true` | Whether to enable drag-and-drop. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | `{ item, index }` custom item. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `unknown[]` | Emitted when the order changes. |
| `reorder` | `unknown[]` | Emitted after a drag or button reorder. |
