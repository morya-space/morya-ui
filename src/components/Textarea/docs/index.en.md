---
title: Textarea
category: 02 / FORM
description: Multi-line text input.
---

# Textarea

Multi-line text input.

## Import

```ts
import { WdTextarea } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTextarea } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WdTextarea v-model="value" label="Notes" placeholder="Write something…" />
</template>
```

## Size & Variant

```vue preview
<script setup lang="ts">
import { WdTextarea } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WdTextarea size="small" label="Small" rows="3" />
    <WdTextarea variant="filled" label="Filled" rows="3" />
    <WdTextarea size="large" fluid label="Large Fluid" rows="3" />
  </div>
</template>
```

## AutoResize & Invalid

`autoResize` grows with content; `invalid` (or the alias `error`) marks a validation failure.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdTextarea } from '@well-insight/ui'

const value = ref('Line 1\nLine 2')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WdTextarea v-model="value" auto-resize label="Auto resize" />
    <WdTextarea invalid label="Required" help-text="This field is required" model-value="" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `helpText` | `string` | — | Helper text. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `error` | `boolean` | `false` | **Alias**; prefer `invalid`. |
| `id` | `string` | — | Native id. |
| `rows` | `number` | `4` | Visible rows. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | CSS resize; forced to `none` when `autoResize` is on. |
| `autoResize` | `boolean` | `false` | Auto-grow with content. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the value changes. |
