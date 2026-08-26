---
title: TreeSelect
category: 02 / FORM
description: Tree select in a dropdown. Supports single/multiple, cascade checks, filter, clear, and path labels.
---

# TreeSelect

Show an expandable tree in a dropdown. `multiple` / `checkable` enable multi-select. `filterable`, `clearable`, and `showPath` cover the common `n-tree-select` subset.

## Import

```ts
import { WiTreeSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const value = ref<string | null>(null)
const options = [
  {
    key: 'docs',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume' },
      { key: 'home', label: 'Home' },
    ],
  },
]
</script>

<template>
  <WiTreeSelect v-model="value" :options="options" />
</template>
```

## Multiple / filter / path

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const value = ref<string[]>([])
const options = [
  {
    key: 'docs',
    label: 'Documents',
    children: [
      { key: 'resume', label: 'Resume' },
      { key: 'home', label: 'Home' },
    ],
  },
]
</script>

<template>
  <WiTreeSelect
    v-model="value"
    :options="options"
    multiple
    checkable
    filterable
    clearable
    show-path
    placeholder="Select nodes"
    style="min-width: 16rem"
  />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiTreeSelect } from '@well-insight/ui'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [{ key: 'docs', label: 'Documents' }]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiTreeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <WiTreeSelect v-model="b" :options="options" placeholder="Default" />
    <WiTreeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `TreeSelectNode[]` | — | Tree nodes. |
| `modelValue` | `string \| string[] \| null` | `null` | Selected key(s); array when multiple. |
| `placeholder` | `string` | locale `selectPlaceholder` | Placeholder text. |
| `size` | `WiSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `multiple` | `boolean` | `false` | Multiple selection. |
| `checkable` | `boolean` | `false` | Show checkboxes (cascade like Tree). |
| `checkStrictly` | `boolean` | `false` | Independent parent/child checks. |
| `checkStrategy` | `'all' \| 'parent' \| 'child'` | `'all'` | Which keys to bind when cascading. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `filterable` | `boolean` | `false` | Filter inside the panel. |
| `showPath` | `boolean` | `false` | Show ancestor labels. |
| `separator` | `string` | `' / '` | Path separator. |
| `maxTagCount` | `number` | — | Max visible tags when multiple. |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Compatibility; prefer `multiple`. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| string[] \| null` | Emitted when the selection changes. |
| `clear` | — | Emitted when cleared. |
