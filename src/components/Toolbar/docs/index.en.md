---
title: Toolbar
category: 06 / LAYOUT
description: Toolbar layout with start / center / end regions.
---

# Toolbar

Horizontal action bar, commonly used as a list page header.

## Import

```ts
import { MButton, MToolbar } from "morya-ui";
```

## Basic

```vue preview src="./demos/Basic.en.vue"

```

## Props

| Prop        | Type                                                       | Default | Description                                           |
| ----------- | ---------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `ariaLabel` | `string`                                                   | —       | Accessible name for the toolbar.                      |
| `pt`        | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | —       | DOM pass-through; see [Styling & attrs](/docs/attrs). |

## Slots

| Slot     | Description        |
| -------- | ------------------ |
| `start`  | Start (left) area. |
| `center` | Center area.       |
| `end`    | End (right) area.  |

## Events

No custom events.
