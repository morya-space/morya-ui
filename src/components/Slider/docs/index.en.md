---
title: Slider
category: 02 / FORM
description: Slider for a single value or a range.
---

# Slider

Drag to pick a number. In `range` mode there are two thumbs and the bound value is `[min, max]`.

## Import

```ts
import { WiSlider } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSlider } from '@well-insight/ui'

const value = ref(40)
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WiSlider v-model="value" />
    <p style="margin:.5rem 0 0;color:var(--wi-color-text-muted)">{{ value }}</p>
  </div>
</template>
```

## Range

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSlider } from '@well-insight/ui'

const value = ref([20, 70])
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WiSlider v-model="value" range />
    <p style="margin:.5rem 0 0;color:var(--wi-color-text-muted)">{{ value.join(' – ') }}</p>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[]` | `0` | Bound value; a two-element array in range mode. |
| `min` | `number` | `0` | Minimum. |
| `max` | `number` | `100` | Maximum. |
| `step` | `number` | `1` | Step. |
| `range` | `boolean` | `false` | Range mode. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Emitted when the value changes. |
