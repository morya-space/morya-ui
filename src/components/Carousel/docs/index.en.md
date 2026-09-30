---
title: Carousel
category: 03 / DATA
description: Carousel for a set of content items with slide / fade / card effects.
---

# Carousel

Inspired by Naive UI: default slot + `MCarouselItem`, multiple effects, dot styles/placement, touch/drag/wheel/keyboard, and autoplay.

## Import

```ts
import { MCarousel, MCarouselItem } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Autoplay

`autoplay` advances every `interval` (default 5000ms). Pauses on hover/focus.

```vue preview src="./demos/Autoplay.vue"
```

## Effects

`effect` supports `slide` (default), `fade`, and `card`.

```vue preview src="./demos/Effects.en.vue"
```

## Multiple slides

Use `slides-per-view` + `space-between`. Enable `draggable` for mouse drag.

```vue preview src="./demos/MultiView.en.vue"
```

## Vertical

Set `direction="vertical"`. Tune dots with `dot-placement` / `dot-type`.

```vue preview src="./demos/Vertical.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `currentIndex` | `number` | — | Controlled index (`v-model:currentIndex`). |
| `defaultIndex` | `number` | `0` | Uncontrolled initial index. |
| `showArrow` | `boolean` | `false` | Show arrows. |
| `showDots` | `boolean` | `true` | Show dots. |
| `dotType` | `'dot' \| 'line'` | `'dot'` | Dot style. |
| `dotPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Dot placement. |
| `slidesPerView` | `number \| 'auto'` | `1` | Visible slides (`slide`). |
| `spaceBetween` | `number` | `0` | Gap between slides (px). |
| `centeredSlides` | `boolean` | `false` | Center the active slide. |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation. |
| `autoplay` | `boolean` | `false` | Auto play. |
| `interval` | `number` | `5000` | Autoplay interval (ms). |
| `loop` | `boolean` | `true` | Loop. |
| `effect` | `'slide' \| 'fade' \| 'card'` | `'slide'` | Transition effect. |
| `trigger` | `'click' \| 'hover'` | `'click'` | How dots activate slides. |
| `touchable` | `boolean` | `true` | Touch swipe. |
| `draggable` | `boolean` | `false` | Mouse drag. |
| `mousewheel` | `boolean` | `false` | Mouse wheel. |
| `keyboard` | `boolean` | `false` | Arrow keys when focused. |
| `transitionDuration` | `number` | `300` | Transition duration (ms). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Slides; prefer `MCarouselItem`. |
| `arrow` | `{ prev, next, total, currentIndex }` custom arrows. |
| `dots` | `{ total, currentIndex, to }` custom dots. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:currentIndex` | `(currentIndex, lastIndex)` | Active index changed. |

## Methods

| Method | Description |
| --- | --- |
| `prev()` | Go to previous. |
| `next()` | Go to next. |
| `to(index)` | Jump to index. |
| `getCurrentIndex()` | Read current index. |
