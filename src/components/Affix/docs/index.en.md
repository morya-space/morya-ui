---
title: Affix
category: 07 / OTHER
description: Fix child content when scroll passes a threshold.
---

# Affix

Pins children with `position: fixed` after scrolling past `offsetTop` / `offsetBottom`.

## Import

```ts
import { MAffix } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `offsetTop` | `number` | `0` when bottom unset | Offset from scroll container top |
| `offsetBottom` | `number` | — | Offset from bottom |
| `target` | `() => HTMLElement \| Window \| null` | `window` | Scroll listener target |
| `disabled` | `boolean` | `false` | Disable affix behavior |
| `pt` | `RootPassThrough` | — | Root pass-through |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `change` | `affixed: boolean` | Affixed state changed |

