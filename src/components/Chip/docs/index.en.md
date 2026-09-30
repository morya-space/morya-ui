---
title: Chip
category: 01 / BASIC
description: Chip displays tagged information, optionally with an icon, image, and remove action.
---

# Chip

Chip displays short tagged information, with optional icon/image and a remove button.

## Import

```ts
import { MChip } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Chip text. |
| `icon` | [IconName](/docs/types#IconName) | — | Leading icon name. |
| `image` | `string` | — | Leading image URL (takes precedence over icon). |
| `removable` | `boolean` | `false` | Show × remove button. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `severity` | `MTagSeverity \| 'warning'` | — | Semantic color. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `remove` | `MouseEvent` | Fired when the remove button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content. |
| `icon` | Leading icon. |
