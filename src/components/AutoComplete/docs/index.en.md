---
title: AutoComplete
category: 02 / FORM
description: Shows suggestion lists while typing; filter locally or supply suggestions from the parent.
---

# AutoComplete

Input suggestions and completion; the `complete` event makes async loading from the parent easy.

## Import

```ts
import { WiAutoComplete } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiAutoComplete } from '@well-insight/ui'

const value = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest', 'Vue Router']
</script>

<template>
  <WiAutoComplete v-model="value" :suggestions="suggestions" dropdown placeholder="Search…" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiAutoComplete } from '@well-insight/ui'

const a = ref('')
const b = ref('')
const c = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest']
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiAutoComplete v-model="a" size="small" :suggestions="suggestions" placeholder="Small" />
    <WiAutoComplete v-model="b" :suggestions="suggestions" placeholder="Default" />
    <WiAutoComplete v-model="c" size="large" :suggestions="suggestions" placeholder="Large" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Input value. |
| `suggestions` | `string[]` | `[]` | Suggestion list. |
| `dropdown` | `boolean` | `false` | Show dropdown button. |
| `placeholder` | `string` | — | Placeholder. |
| `size` | `WiSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value change. |
| `complete` | `query: string` | Request completion. |
