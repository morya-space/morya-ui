---
title: Tree
category: 03 / DATA
description: Tree structure. Supports check with indeterminate state, filter, controlled expand, lazy load, and drag-and-drop.
---

# Tree

Hierarchical node tree with expand, check, filter, and drag-and-drop.

**Naive differences:** the default slot `{ node, data }` customizes node content. `checkStrategy` is `'all' | 'parent' | 'child'` (ignored when `checkStrictly`). Cascade still drives the UI; `v-model:checked-keys` is projected by strategy. Virtual scroll is out of scope.

## Import

```ts
import { WiTree } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTree } from '@well-insight/ui'
import { ref } from 'vue'

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
  <WiTree v-model="selected" :value="nodes" default-expand-all />
</template>
```

## Checkbox

```vue preview
<script setup lang="ts">
import { WiTree } from '@well-insight/ui'
import { ref } from 'vue'

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
  <WiTree
    v-model:checked-keys="checkedKeys"
    :value="nodes"
    show-checkbox
    default-expand-all
  />
</template>
```

## Check strategy

With `check-strategy="child"`, checking a parent binds leaf keys only (Naive `n-tree`).

```vue preview
<script setup lang="ts">
import { WiTree } from '@well-insight/ui'
import { ref } from 'vue'

const checkedKeys = ref<Record<string, boolean>>({})
const nodes = [
  {
    key: '0',
    label: 'Documents',
    children: [
      { key: '0-0', label: 'Work' },
      { key: '0-1', label: 'Home' },
    ],
  },
]
</script>

<template>
  <div style="display:grid;gap:0.5rem">
    <WiTree
      v-model:checked-keys="checkedKeys"
      :value="nodes"
      show-checkbox
      check-strategy="child"
      default-expand-all
    />
    <p style="margin:0;color:var(--wi-color-text-muted);font-size:0.875rem">
      keys: {{ Object.keys(checkedKeys).join(', ') || '(none)' }}
    </p>
  </div>
</template>
```

## Filter

```vue preview
<script setup lang="ts">
import { WiInput, WiTree } from '@well-insight/ui'
import { ref } from 'vue'

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
    <WiInput v-model="query" placeholder="Filter nodes" clearable fluid />
    <WiTree :value="nodes" :filter="query" default-expand-all />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `TreeNode[]` | — | Node tree. |
| `modelValue` / `selectionKeys` / `selectionMode` | — | — | Highlight selection. |
| `showCheckbox` / `checkedKeys` / `checkStrictly` / `checkStrategy` | — | `'all'` | `checkStrategy` defaults to `'all'`; `'parent'` / `'child'` only change which keys are bound. |
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

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `node-select` | `TreeNode` | Node selected. |
| `node-expand` | `TreeNode` | Node expanded. |
| `node-collapse` | `TreeNode` | Node collapsed. |
