---
title: InputTags
category: 02 / FORM
description: Chip-style tag input; press Enter to add, removable.
---

# InputTags

Manage string tags as a chip list.

## Import

```ts
import { WiInputTags } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputTags } from '@well-insight/ui'

const tags = ref(['vue', 'design'])
</script>

<template>
  <WiInputTags v-model="tags" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | Tag list. |
| `placeholder` | `string` | locale `addTag` | Placeholder when the list is empty. |
| `disabled` | `boolean` | `false` | Disabled. |
| `addOnBlur` | `boolean` | `false` | Also add on blur. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | Tags changed. |
