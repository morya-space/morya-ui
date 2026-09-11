---
title: ProgressSpinner
category: 05 / FEEDBACK
description: SVG circular loading indicator with configurable stroke width and animation duration.
---

# ProgressSpinner

SVG circular loading indicator.

## Import

```ts
import { MProgressSpinner } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MProgressSpinner } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <MProgressSpinner />
    <MProgressSpinner stroke-width="4" animation-duration="0.6s" />
  </div>
</template>
```

## Wrap

When wrapping content, `show` toggles the overlay and `delay` waits before it appears.

```vue preview
<script setup lang="ts">
import { MButton, MProgressSpinner } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <MProgressSpinner :show="loading" description="Loading">
    <p style="margin:0">
      Form content
    </p>
  </MProgressSpinner>
  <MButton label="Toggle" size="small" @click="loading = !loading" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle stroke width. |
| `animationDuration` | `string` | `'1s'` | Rotation animation duration. |
| `ariaLabel` | `string` | locale `loading` | Accessible name. |
| `show` | `boolean` | `true` | Overlay visibility when wrapping content. |
| `delay` | `number` | `0` | Delay before showing (ms). |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `description` | `string` | — | Caption under the spinner. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
