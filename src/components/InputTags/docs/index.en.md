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
import { WiInputTags } from '@well-insight/ui'
import { ref } from 'vue'

const tags = ref(['vue', 'design'])
</script>

<template>
  <WiInputTags v-model="tags" />
</template>
```

## Max & separator

`max` caps the number of tags. `separator` splits pasted or typed values (for example `,`).

```vue preview
<script setup lang="ts">
import { WiInputTags } from '@well-insight/ui'
import { ref } from 'vue'

const tags = ref(['vue'])
</script>

<template>
  <WiInputTags v-model="tags" :max="3" separator="," placeholder="Comma-separated, max 3" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | Tag list. |
| `placeholder` | `string` | locale `addTag` | Placeholder when the list is empty. |
| `disabled` | `boolean` | `false` | Disabled. |
| `addOnBlur` | `boolean` | `false` | Also add on blur. |
| `max` | `number` | — | Maximum number of tags. |
| `separator` | `string \| string[]` | — | Extra separators, for example `,`. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string[]` | Tags changed. |
