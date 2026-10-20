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

## Mask click

Clicking the mask does not close the dialog by default; set `dismissableMask` (or `closeOnOutsideClick` / `maskClosable`) to enable it.

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
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model`. |
| `title` | `string` | — | Title text. |
| `header` | `string` | — | Alias of `title`. |
| `closeOnEsc` | `boolean` | `true` | Close on Esc. |
| `blockScroll` | `boolean` | `true` | Lock page scroll while open (when `modal` is true). |
| `closeOnOutsideClick` | `boolean` | `false` | Close when clicking the mask. |
| `dismissableMask` | `boolean` | — | Alias of `closeOnOutsideClick`. |
| `maskClosable` | `boolean` | — | Alias of `closeOnOutsideClick` . |
| `closable` | `boolean` | `true` | Show the close button. |
| `maximizable` | `boolean` | `false` | Show the maximize / restore button. |
| `modal` | `boolean` | `true` | Overlay mask. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | Dialog position. |
| `centered` | `boolean` | — | Vertical centering: `true` → `center`, `false` → `top`; omit to use `position`. |
| `width` | `string` | — | Dialog width (ignored when maximized). |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target; `'self'` renders in place. |
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | — | Status icon in the header |
| `positiveText` / `negativeText` | `string` | — | Preset footer buttons; ignored when the `footer` slot is used |
| `positiveColor` | [ButtonColor](/docs/types#ButtonColor) | — | Confirm button color |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | Return `false` to keep the dialog open |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | Runs before X / Esc / mask dismiss; return `false` to keep open |
| `ariaLabel` | `string` | — | Accessible dialog name. |
| `transition` | `string \| false` | `'zoom'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [DialogPassThrough](/docs/types#DialogPassThrough) | — | Attributes for named Dialog DOM parts. |

## Styling & attrs

After Teleport, fallthrough attrs on `<MDialog>` (`class`, `style`, `data-*`, `title`, …) land on the **backdrop** (`.m-dialog-backdrop`), not the inner `.m-dialog` panel. Use the `width` prop for panel width and `pt` for inner DOM. Do not depend on page-level scoped CSS ancestor selectors: after Teleport, the page container is no longer a DOM ancestor of the dialog.

`pt` targets `class`, `style`, `data-*`, and native attrs at a named part, remaining stable with Teleport and scoped styles:

```vue
<MDialog
  v-model="visible"
  width="48rem"
  :pt="{
    panel: { class: 'account-dialog', style: { '--m-dialog-radius': '1rem' } },
    body: { class: 'account-dialog__body' },
  }"
/>
```

| `pt` key | Target element | Purpose |
| --- | --- | --- |
| `root` | `.m-dialog-backdrop` | Full-screen mask and overlay root. |
| `zoom` | `.m-dialog-zoom` | Positioning container responsible for enter/leave transforms. |
| `panel` | `.m-dialog` | Dialog panel; use for local CSS variables, classes, and data attributes. |
| `header` | `.m-dialog__header` | Header, rendered only when it has title, icon, or actions. |
| `body` | `.m-dialog__body` | Content area. |
| `footer` | `.m-dialog__footer` | Footer, rendered only for the `footer` slot or preset actions. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `close` | — | Emitted when closing. |
| `show` | — | Emitted when opening. |
| `hide` | — | Emitted after closing. |
| `maximize` | — | Enter maximize. |
| `unmaximize` | — | Exit maximize. |

## Methods

| Method | Description |
| --- | --- |
| `close()` | Close the dialog (same as the cancel/close action). |
| `maximize()` | Maximize; no-op when already maximized. |
| `unmaximize()` | Leave the maximized state. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dialog content. |
| `header` | Custom header area. |
| `footer` | Footer actions. |

## Imperative API (useModal / modal)

Open dialogs without writing a template:

```ts
import { modal, useModal } from 'morya-ui'

// Module-level singleton
modal.confirm({
  title: 'Delete this item?',
  content: 'This cannot be undone',
  onOk: async () => { await remove() },
})

// Or a component-scoped instance
const dialog = useModal()
dialog.success({ title: 'Saved' })
```

Every call returns `{ destroy, update }`: `update` patches the title / content while open, `destroy` closes and unmounts immediately. `modal.destroyAll()` closes every dialog created through the API.

| Method | Description |
| --- | --- |
| `info(options)` | Message dialog (no cancel button by default) |
| `success(options)` | Success dialog |
| `warning(options)` | Warning dialog |
| `error(options)` | Error dialog |
| `confirm(options)` | Confirmation dialog (cancel button shown by default) |
| `destroyAll()` | Close all |

Passing a string as `options` is shorthand for `{ content: '...' }`.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Title |
| `content` | `string \| VNode` | — | Body |
| `type` | `DialogType` | — | Header status icon |
| `okText` / `cancelText` | `string` | locale | Button labels |
| `showCancel` | `boolean` | `false` for status helpers, `true` for `confirm` | Show the cancel button |
| `okColor` | `ButtonColor` | `'primary'` | Confirm button color |
| `width` / `position` / `centered` | as Dialog | — | Layout |
| `maskClosable` | `boolean` | `false` | Dismiss by clicking the mask |
| `onOk` | `() => void \| Promise<void>` | — | Confirm handler; a returned Promise puts the button in a loading state |
| `onCancel` | `() => void` | — | Cancel / dismiss handler |
| `afterClose` | `() => void` | — | Called after the close transition |

> Imperative dialogs render in place inside their mount container (no Teleport) so they can be destroyed precisely.
