---
title: Slider
category: 02 / FORM
description: Slider for a single value or a range.
---

# Slider

Drag to pick a number. In `range` mode there are two thumbs and the bound value is `[min, max]`.

## Import

```ts
import { WdSlider } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdSlider } from '@wex-design/ui'
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WdSlider v-model="value" />
    <p style="margin:.5rem 0 0;color:var(--wd-color-text-muted)">
      {{ value }}
    </p>
  </div>
</template>
```

## Range

```vue preview
<script setup lang="ts">
import { WdSlider } from '@wex-design/ui'
import { ref } from 'vue'

const value = ref([20, 70])
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WdSlider v-model="value" range />
    <p style="margin:.5rem 0 0;color:var(--wd-color-text-muted)">
      {{ value.join(' – ') }}
    </p>
  </div>
</template>
```

## Marks & vertical

`marks` can be a number array or a value-to-label map. `tooltip` shows the current value while dragging.

```vue preview
<script setup lang="ts">
import { WdSlider } from '@wex-design/ui'
import { ref } from 'vue'

const value = ref(50)
</script>

<template>
  <div style="display:flex;gap:2rem;align-items:stretch;height:10rem">
    <div style="flex:1">
      <WdSlider v-model="value" tooltip :marks="{ 0: '0', 50: 'Mid', 100: 'Max' }" />
    </div>
    <WdSlider v-model="value" vertical tooltip />
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
| `marks` | `number[] \| Record<number, string>` | — | Tick marks; array of values, or a value-to-label map. |
| `tooltip` | `boolean` | `false` | Show the current value while dragging. |
| `vertical` | `boolean` | `false` | Vertical layout. |
| `disabled` | `boolean` | `false` | Disabled. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | Emitted when the value changes. |

## Slots

No slots.
