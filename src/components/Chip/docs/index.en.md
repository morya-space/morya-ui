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
| `label` | `string` | 鈥?| Chip text. |
| `icon` | [IconName](/docs/types#IconName) | 鈥?| Leading icon name. |
| `image` | `string` | 鈥?| Leading image URL (takes precedence over icon). |
| `removable` | `boolean` | `false` | Show 脳 remove button. |
| `disabled` | `boolean` | `false` | Disable interaction. |
| `type` | `MTagType` | — | Semantic color. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | 鈥?| Size. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM pass-through; see [attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `remove` | `MouseEvent` | Fired when the remove button is clicked. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Label content. |
| `icon` | Leading icon. |
