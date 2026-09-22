---
title: BlockUI
category: 05 / FEEDBACK
description: Overlays content with a mask to block interaction.
---

# BlockUI

Wraps content and shows a mask when `blocked` is true.

## Import

```ts
import { MBlockUI } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | Whether the overlay is active. |
| `transition` | `string \| false` | `'blockui'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

No custom events.

## Slots

No slots.
