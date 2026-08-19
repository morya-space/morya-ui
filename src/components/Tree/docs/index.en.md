---
title: Tree
category: 06 / DATA
description: Tree structure. Supports check with indeterminate state, filter, controlled expand, lazy load, and drag-and-drop.
---

# Tree

Hierarchical node tree with expand, check, filter, and drag-and-drop.

## Import

```ts
import { WdTree } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTree } from '@well-insight/ui'

const selected = ref<string | null>(null)
const nodes = [
  {
    key: '0',
    label: 'Documents',
    icon: 'menu',
    children: [
      { key: '0-0', label: 'Work', icon: 'edit' },
      { key: '0-1', label: 'Home', icon: 'home' },
    ],
  },
]
</script>

<template>
  <WdTree v-model="selected" :value="nodes" default-expand-all />
</template>
```

## Checkbox

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTree } from '@well-insight/ui'

const checkedKeys = ref({})
const nodes = [
  {
    key: '1',
    label: 'Guide',
    children: [
      { key: '1-1', label: 'Install' },
      { key: '1-2', label: 'Quick Start' },
    ],
  },
]
</script>

<template>
  <WdTree
    v-model:checked-keys="checkedKeys"
    :value="nodes"
    show-checkbox
    default-expand-all
  />
</template>
```

## Filter

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInput, WdTree } from '@well-insight/ui'

const query = ref('')
const nodes = [
  {
    key: 'a',
    label: 'Components',
    children: [
      { key: 'a-1', label: 'Button' },
      { key: 'a-2', label: 'Table' },
      { key: 'a-3', label: 'Tree' },
    ],
  },
]
</script>

<template>
  <div style="display:grid;gap:0.75rem;max-width:20rem">
    <WdInput v-model="query" placeholder="Filter nodes" clearable fluid />
    <WdTree :value="nodes" :filter="query" default-expand-all />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode[]` | — | Node tree. |
| `modelValue` / `selectionKeys` / `selectionMode` | — | — | Highlight selection. |
| `showCheckbox` / `checkedKeys` / `checkStrictly` | — | — | Check and indeterminate state. |
| `expandedKeys` / `defaultExpandAll` / `accordion` | — | — | Expand control. |
| `filter` / `filterNode` | — | — | Filter. |
| `lazy` / `load` | — | — | Lazy-load child nodes. |
| `draggable` | `boolean` | `false` | Drag and drop; the drop target is applied by the consumer via `node-drop`. |

## Slots / Events

| Slot | Description |
| --- | --- |
| `default` | `{ node, data }` custom node content. |

| Event | Description |
| --- | --- |
| `update:checkedKeys` / `update:expandedKeys` / `check` / `node-expand` / `node-collapse` / `node-drop` | Interaction callbacks. |
