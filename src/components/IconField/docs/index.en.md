---
title: IconField
category: 02 / FORM
description: Container that places an icon on the left or right of an input.
---

# IconField

Place an icon to the left or right of an input control.

## Import

```ts
import { MIcon, MIconField, MInput } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Input control. |
| `icon` | Icon content. |

## Events

No custom events.
