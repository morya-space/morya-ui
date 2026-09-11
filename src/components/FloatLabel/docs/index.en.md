---
title: FloatLabel
category: 02 / FORM
description: Floating label wrapper. The label floats up when focused or when the field has a value.
---

# FloatLabel

Wraps an input. The label floats up on focus or when the field has content. Nested inputs should set a non-empty `placeholder` (such as a space) so `:placeholder-shown` works as expected.

## Import

```ts
import { MFloatLabel, MInput } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MFloatLabel, MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MFloatLabel label="Username">
    <MInput v-model="value" placeholder=" " />
  </MFloatLabel>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Label text; the `label` slot can also be used. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Input control. |
| `label` | Custom label content. |

## Accessibility

- After mount, sets `<label for>` on the first `input` / `textarea` / `select` in the container.
- Child controls should have an `id`, or use library inputs that generate one.
- With `placeholder=" "`, ensure the field purpose is still clear to assistive tech via the label or `aria-label`.

## Events

No custom events.
