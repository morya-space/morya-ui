---
title: Rating
category: 02 / FORM
description: Star rating control with clear and readonly support.
---

# Rating

Click stars to rate. A clear button is shown by default.

## Import

```ts
import { WkRating } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkRating } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <WkRating v-model="value" />
</template>
```

## Readonly

```vue preview
<script setup lang="ts">
import { WkRating } from '@wise-kit/ui'
</script>

<template>
  <WkRating :model-value="4" readonly :cancel="false" />
</template>
```

## Half

`allowHalf` enables 0.5 increments. `allowClear` is an alias of `cancel` and takes precedence when set.

```vue preview
<script setup lang="ts">
import { WkRating } from '@wise-kit/ui'
import { ref } from 'vue'

const value = ref(2.5)
</script>

<template>
  <WkRating v-model="value" allow-half />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current rating. |
| `stars` | `number` | `5` | Number of stars. |
| `cancel` | `boolean` | `true` | Show the clear button. |
| `allowClear` | `boolean \| null` | `null` | Alias of `cancel`; takes precedence when set. |
| `allowHalf` | `boolean` | `false` | Allow half-star values. |
| `readonly` | `boolean` | `false` | Read-only. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted when the rating changes. |

## Slots

| Slot | Description |
| --- | --- |
| `icon` | Custom star `{ active }`. |
