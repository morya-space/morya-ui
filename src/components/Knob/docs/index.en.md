---
title: Knob
category: 02 / FORM
description: SVG circular knob for selecting a numeric value.
---

# Knob

Circular dial control with drag and keyboard adjustment.

## Import

```ts
import { MKnob } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MKnob } from 'morya-ui'
import { ref } from 'vue'

const value = ref(60)
</script>

<template>
  <MKnob v-model="value" :size="120" value-template="{value}%" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current value. |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | Range and step. |
| `size` | `number` | `100` | Diameter in pixels. |
| `valueTemplate` | `string` | `{value}` | Display template. |
| `disabled` | `boolean` | `false` | Disabled. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Value changed. |

## Slots

No slots.
