---
title: PickList
category: 03 / DATA
description: Dual-list picker for moving items between lists.
---

# PickList

Move items between the source and target lists.

## Import

```ts
import { WiPickList } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiPickList } from '@well-insight/ui'
import { ref } from 'vue'

const source = ref(['Apple', 'Banana', 'Cherry', 'Grape'])
const target = ref(['Durian'])
</script>

<template>
  <WiPickList
    v-model:source="source"
    v-model:target="target"
    source-header="Available fruit"
    target-header="Selected fruit"
  />
</template>
```

## Custom items

```vue preview
<script setup lang="ts">
import { WiPickList } from '@well-insight/ui'
import { ref } from 'vue'

const source = ref([
  { id: 1, name: 'Design' },
  { id: 2, name: 'Engineering' },
])
const target = ref([{ id: 3, name: 'Testing' }])
</script>

<template>
  <WiPickList v-model:source="source" v-model:target="target" data-key="id">
    <template #item="{ item }">
      <strong>{{ item.name }}</strong>
    </template>
  </WiPickList>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `unknown[]` | `[]` | Source list. |
| `target` | `unknown[]` | `[]` | Target list. |
| `sourceHeader` | `string` | locale `sourceHeader` | Source header. |
| `targetHeader` | `string` | locale `targetHeader` | Target header. |
| `dataKey` | `string` | — | Unique key for object items. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:source` | `unknown[]` | Emitted when the source list changes. |
| `update:target` | `unknown[]` | Emitted when the target list changes. |

## Slots

| Slot | Prop | Description |
| --- | --- | --- |
| `item` | `{ item, index }` | Custom list item content. |
