---
title: Drawer
category: 05 / FEEDBACK
description: Side drawer panel.
---

# Drawer

Side drawer that slides in from the screen edge. Suited to navigation, filters, or detail panels.

## Import

```ts
import { MButton, MDrawer } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Position

Supports `left` / `right` / `top` / `bottom`.

```vue preview src="./demos/Position.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model`. |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | Edge the drawer appears from. |
| `modal` | `boolean` | `true` | Show the overlay mask. |
| `dismissable` | `boolean` | `true` | Close when clicking the mask. |
| `showCloseIcon` | `boolean` | `true` | Show the close button. |
| `header` | `string` | — | Header text. |
| `width` | `number \| string` | — | Width for left/right drawers (`number` = px). |
| `height` | `number \| string` | — | Height for top/bottom drawers (`number` = px). |
| `blockScroll` | `boolean` | `true` | Lock `body` scroll while open. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'drawer'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `show` | — | Emitted when opening. |
| `hide` | — | Emitted after closing. |
| `after-leave` | — | Emitted when the leave animation finishes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Drawer content. |
| `header` | Custom header area. |
