---
title: Label
category: 01 / BASIC
description: Accessible form label.
---

# Label

Simple label with `htmlFor` / `for` and a default slot.

## Import

```ts
import { MLabel } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | — | Associated control id. |
| `for` | `string` | — | Alias for `htmlFor`. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Slots

| Slot | Description |
| --- | --- |
| `default` | Label text. |

## Events

No custom events.
