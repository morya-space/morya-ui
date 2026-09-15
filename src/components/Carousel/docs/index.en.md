---
title: Carousel
category: 03 / DATA
description: Carousel for a set of content items.
---

# Carousel

Slides content in a window of `numVisible` items.

## Import

```ts
import { MCarousel } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Autoplay

`autoplay` advances pages every `interval` (default 3000ms). `show-arrows` / `show-indicators` control arrows and dots.

```vue preview src="./demos/Autoplay.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `unknown[]` | — | Content list. |
| `numVisible` | `number` | `1` | Number of items visible at once. |
| `circular` | `boolean` | `false` | Loop paging. |
| `autoplay` | `boolean` | `false` | Auto-advance. |
| `interval` | `number` | `3000` | Autoplay interval in milliseconds. |
| `showArrows` | `boolean` | `true` | Show prev/next arrows. |
| `showIndicators` | `boolean` | `true` | Show page dots. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `item` | `{ item, index }` for each item. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:page` | `number` | Page change. |
