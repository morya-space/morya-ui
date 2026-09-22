---
title: ConfirmDialog
category: 05 / FEEDBACK
description: Confirm / cancel dialog that reuses Dialog overlay styling.
---

# ConfirmDialog

Modal dialog used when the user must explicitly confirm an action.

## Import

```ts
import { MButton, MConfirmDialog } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. |
| `header` | `string` | locale `confirm` | Title. |
| `message` | `string` | — | Body text. |
| `acceptLabel` | `string` | locale `accept` | Accept button label. |
| `rejectLabel` | `string` | locale `reject` | Reject button label. |
| `acceptSeverity` | [ButtonSeverity](/docs/types#ButtonSeverity) | — | Accept button semantic color. |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | Status icon beside the message. |
| `loading` | `boolean` | `false` | Loading state on the accept button. |
| `beforeAccept` | `() => unknown \| Promise<unknown>` | — | Return `false` to keep open and skip `accept`. |
| `beforeReject` | `() => unknown \| Promise<unknown>` | — | Return `false` to keep open and skip `reject`. |
| `teleport` | `boolean` | `true` | Overlay Teleport; defaults to `body`. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |
| `transition` | `string \| false` | `'dialog'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |


## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `accept` | — | Accept clicked. |
| `reject` | — | Reject clicked or dialog closed. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dialog body. |
