---
title: ScrollTop
category: 07 / MISC
description: Shows a back-to-top button after scrolling past a threshold.
---

# ScrollTop

Listens to window or parent scroll and jumps back to the top.

## Import

```ts
import { WdScrollTop } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdScrollTop } from '@well-insight/ui'
</script>

<template>
  <div style="height: 8rem; overflow: auto; position: relative">
    <div style="height: 40rem">Scroll down…</div>
    <WdScrollTop :threshold="80" target="parent" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | Show threshold in px. |
| `target` | `'window' \| 'parent'` | `'window'` | Scroll target. |
| `teleport` | `boolean` | `true` | Overlay Teleport. Mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target. `'self'` / `false` renders in place. |
