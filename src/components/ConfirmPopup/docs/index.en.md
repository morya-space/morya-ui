---
title: ConfirmPopup
category: 05 / FEEDBACK
description: Confirmation popover anchored to a target.
---

# ConfirmPopup

Lightweight confirmation overlay. Supports `target` or coordinate positioning.

## Import

```ts
import { MConfirmPopup } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Before accept

Returning `false` from `beforeAccept` keeps the popup open and skips the `accept` emit.

```vue preview src="./demos/BeforeAccept.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Whether the popup is shown. |
| `message` | `string` | — | Prompt text. |
| `acceptLabel` / `rejectLabel` | `string` | `OK` / `Cancel` | Buttons. |
| `icon` | [IconName](/docs/types#IconName) | — | Icon beside the message. |
| `beforeAccept` | `() => boolean \| Promise<boolean>` | — | Return `false` to keep the popup open. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position relative to `target`. |
| `target` | `HTMLElement \| null` | — | Anchor element. |
| `position` | `{ top, left } \| null` | — | Coordinates when there is no anchor. |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility. |
| `accept` / `reject` | — | Accept / reject. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Popup body. |
