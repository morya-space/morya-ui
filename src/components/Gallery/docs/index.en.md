---
title: Gallery
category: 03 / DATA
description: Image gallery with a main image and thumbnails.
---

# Gallery

Browse an image list and keep `activeIndex` in sync.

## Import

```ts
import { MGallery } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `string[]` | — | Image URLs. |
| `activeIndex` | `number` | `0` | Current index. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:activeIndex` | `number` | Index change. |

## Slots

| Slot | Description |
| --- | --- |
| `item` | Media item `{ item, index }`. |
