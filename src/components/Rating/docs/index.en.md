---
title: Rating
category: 02 / FORM
description: Star rating control with clear and readonly support.
---

# Rating

Click stars to rate. A clear button is shown by default.

## Import

```ts
import { WdRating } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdRating } from '@well-insight/ui'

const value = ref(3)
</script>

<template>
  <WdRating v-model="value" />
</template>
```

## Readonly

```vue preview
<script setup lang="ts">
import { WdRating } from '@well-insight/ui'
</script>

<template>
  <WdRating :model-value="4" readonly :cancel="false" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current rating. |
| `stars` | `number` | `5` | Number of stars. |
| `cancel` | `boolean` | `true` | Show the clear button. |
| `readonly` | `boolean` | `false` | Read-only. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the rating changes. |
