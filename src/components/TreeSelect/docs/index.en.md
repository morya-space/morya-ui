---
title: TreeSelect
category: 02 / FORM
description: Single-select tree in a dropdown panel.
---

# TreeSelect

Show an expandable tree in a dropdown and select a single node.

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
| `modelValue` | `string \| null` | `null` | Selected node key. |
| `placeholder` | `string` | locale `selectPlaceholder` | Placeholder text. |
| `size` | `WiSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `selectionMode` | `'single'` | `'single'` | Selection mode. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | Emitted when the selection changes. |
