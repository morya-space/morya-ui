---
title: Knob
category: 02 / FORM
description: SVG circular knob for selecting a numeric value.
---

# Knob

Circular dial control with drag and keyboard adjustment.

## Import

```ts
import { WdKnob } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdKnob } from '@well-insight/ui'

const value = ref(60)
</script>

<template>
  <WdKnob v-model="value" :size="120" value-template="{value}%" />
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

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Value changed. |
