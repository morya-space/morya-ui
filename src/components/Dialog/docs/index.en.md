---
title: Dialog
category: 05 / FEEDBACK
description: Modal dialog with preset footer actions, async close guards, and status type.
---

# Dialog

Modal dialog. Visibility uses `v-model` (`modelValue`), corresponding to `visible`.

## Import

```ts
import { MButton, MDialog } from 'morya-ui'
```

## Basic

```vue preview src="./demos/Basic.vue"
```

## Positions

Supports `center` / `top` / `bottom` / `left` / `right` and the four corner positions.

```vue preview src="./demos/Positions.vue"
```

## Footer actions

```vue preview src="./demos/FooterActions.vue"
```

## No dismiss mask

With `dismissableMask={false}` (or `closeOnOutsideClick={false}`), clicking the mask does not close the dialog.

```vue preview src="./demos/NoDismissMask.vue"
```

## Maximizable

`maximizable` adds a maximize / restore toggle in the title bar.

```vue preview src="./demos/Maximizable.vue"
```

## Preset footer and async close

`positiveText` / `negativeText` render confirm / cancel buttons (`footer` slot wins). Return `false` (including from a Promise) to keep the dialog open. Use [ConfirmDialog](/components/ConfirmDialog) for accept/reject flows; Dialog `type` is a header icon only.

```vue preview src="./demos/PresetFooterAndAsyncClose.en.vue"
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model` (corresponding to `visible`). |
| `title` | `string` | — | Title text. |
| `header` | `string` | — | Alias of `title`. |
| `closeOnEsc` | `boolean` | `true` | Close on Esc. |
| `blockScroll` | `boolean` | `true` | Lock page scroll while open (when `modal` is true). |
| `closeOnOutsideClick` | `boolean` | `true` | Close when clicking the mask. |
| `dismissableMask` | `boolean` | — | Alias of `closeOnOutsideClick`. |
| `closable` | `boolean` | `true` | Show the close button. |
| `maximizable` | `boolean` | `false` | Show the maximize / restore button. |
| `modal` | `boolean` | `true` | Overlay mask. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | Dialog position. |
| `width` | `string` | — | Dialog width (ignored when maximized). |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target; `'self'` renders in place. |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | Status icon in the header; `warning` is an alias of `warn` |
| `positiveText` / `negativeText` | `string` | — | Preset footer buttons; ignored when the `footer` slot is used |
| `positiveSeverity` | [ButtonSeverity](/docs/types#ButtonSeverity) | — | Confirm button severity |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | Return `false` to keep the dialog open |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | Runs before X / Esc / mask dismiss; return `false` to keep open |
| `ariaLabel` | `string` | — | Accessible dialog name. |
| `transition` | `string \| false` | `'dialog'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Backdrop pass-through; key `root`. |

## Styling & attrs

After Teleport, fallthrough attrs on `<MDialog>` (`class`, `style`, `data-*`, `title`, …) land on the **backdrop** (`.m-dialog-backdrop`), not the inner `.m-dialog` panel. Use the `width` prop for panel width; use `pt` for inner DOM. See [Styling & attrs](/docs/attrs).

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `close` | — | Emitted when closing. |
| `show` | — | Emitted when opening. |
| `hide` | — | Emitted after closing. |
| `maximize` | — | Enter maximize. |
| `unmaximize` | — | Exit maximize. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dialog content. |
| `header` | Custom header area. |
| `footer` | Footer actions. |
