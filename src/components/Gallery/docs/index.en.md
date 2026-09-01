---
title: Gallery
category: 11 / MEDIA
description: Image gallery with a main image and thumbnails.
---

# Gallery

Browse an image list and keep `activeIndex` in sync.

## Import

```ts
import { WiGallery } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiGallery } from '@well-insight/ui'
import { ref } from 'vue'

const activeIndex = ref(0)
const images = [
  'https://picsum.photos/seed/wd1/640/360',
  'https://picsum.photos/seed/wd2/640/360',
  'https://picsum.photos/seed/wd3/640/360',
]
</script>

<template>
  <WiGallery v-model:active-index="activeIndex" :images="images" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `string[]` | — | Image URLs. |
| `activeIndex` | `number` | `0` | Current index. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:activeIndex` | `number` | Index change. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | Media item `{ item, index }`. |
