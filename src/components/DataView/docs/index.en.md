---
title: DataView
category: 06 / DATA
description: Display data in a list or grid layout, with optional pagination.
---

# DataView

Render a collection in list / grid layout, with optional pagination.

## Import

```ts
import { WiDataView } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiDataView } from '@well-insight/ui'

const items = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
</script>

<template>
  <WiDataView :value="items" layout="grid" paginator :rows="4">
    <template #grid="{ items: page }">
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
        <div v-for="item in page" :key="item">
          {{ item }}
        </div>
      </div>
    </template>
  </WiDataView>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any[]` | `[]` | Data. |
| `layout` | `'list' \| 'grid'` | `'list'` | Layout. |
| `paginator` | `boolean` | `false` | Enable pagination. |
| `rows` | `number` | `10` | Rows per page. |

## Slots

| Slot | Description |
| --- | --- |
| `list` | List layout, `{ items }`. |
| `grid` | Grid layout, `{ items }`. |
