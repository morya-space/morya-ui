---
title: ScrollTop
category: 04 / NAVIGATION
description: Shows a back-to-top button after scrolling past a threshold.
---

# ScrollTop

Listens to window or parent scroll and jumps back to the top.

## Import

```ts
import { WdScrollTop } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdScrollTop } from '@wex-design/ui'
</script>

<template>
  <div style="height: 8rem; overflow: auto; position: relative">
    <div style="height: 40rem">
      Scroll down…
    </div>
    <WdScrollTop :threshold="80" target="parent" :right="16" :bottom="16" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | Show threshold in px. |
| `target` | `'window' \| 'parent'` | `'window'` | Scroll target. |
| `right` | `string \| number` | — | Distance from the right edge; a number is pixels. |
| `bottom` | `string \| number` | — | Distance from the bottom edge; a number is pixels. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |

## Events

No custom events.

## Slots

No slots.
