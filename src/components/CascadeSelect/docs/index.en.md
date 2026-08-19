---
title: CascadeSelect
category: 02 / FORM
description: Multi-level cascade select with nested options and column panels.
---

# CascadeSelect

Select a value step by step from nested options.

## Import

```ts
import { WdCascadeSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdCascadeSelect } from '@well-insight/ui'

const value = ref<string | number | null>(null)
const options = [
  {
    label: 'Electronics',
    value: 'electronics',
    children: [
      { label: 'Phone', value: 'phone' },
      { label: 'Laptop', value: 'laptop' },
    ],
  },
  { label: 'Books', value: 'books' },
]
</script>

<template>
  <WdCascadeSelect v-model="value" :options="options" placeholder="Select a category" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdCascadeSelect } from '@well-insight/ui'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [
  { label: 'Books', value: 'books' },
  { label: 'Media', value: 'media' },
]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WdCascadeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <WdCascadeSelect v-model="b" :options="options" placeholder="Default" />
    <WdCascadeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `null` | Selected value. |
| `options` | `CascadeSelectOption[]` | — | Nested options. |
| `placeholder` | `string` | locale `selectPlaceholder` | Placeholder text. |
| `size` | `WdSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `CascadeSelectValue` | Selection change. |
