---
title: ProgressSpinner
category: 07 / MISC
description: SVG circular loading indicator with configurable stroke width and animation duration.
---

# ProgressSpinner

SVG circular loading indicator.

## Import

```ts
import { WdProgressSpinner } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdProgressSpinner } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WdProgressSpinner />
    <WdProgressSpinner stroke-width="4" animation-duration="0.6s" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle stroke width. |
| `animationDuration` | `string` | `'1s'` | Rotation animation duration. |
| `ariaLabel` | `string` | locale `loading` | Accessible name. |
