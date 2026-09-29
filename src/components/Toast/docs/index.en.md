---
title: Toast
category: 05 / FEEDBACK
description: Corner floating notifications with API and controlled lists.
---

# Toast

Corner notifications with a title and optional detail. Use the `toast` API, or keep rendering with a controlled `:messages` list.

Vs [Message](/components/Message): Message is the **default** for short single-line feedback; Toast is for `summary` / `detail` or corner notifications. `max` applies to the service queue only.

> Selection guide: [`feedback.md`](../../../../design-kit/.agents/skills/morya-ui-pages/references/feedback.md).

Do **not** use `toast.add({ summary: 'Saved' })` when `message.success('Saved')` is enough.


## When to use

- Corner floating notifications with API and controlled lists
- Prefer composing documented `M*` APIs; see [Common Props](/docs/common-props).

## Import

```ts
import { MToast, toast, useToast } from 'morya-ui'
```

## API

```vue preview src="./demos/Api.en.vue"
```

## Custom content

`summary` / `detail` also accept strings, `h()` VNodes, components, or render factories.

```vue preview src="./demos/CustomContent.en.vue"
```

## Controlled

You can still manage the list yourself with `messages` + `close`.

```vue preview src="./demos/Controlled.vue"
```

## Methods

| Method | Description |
| --- | --- |
| `toast.success / info / warn / error` | Add by severity |
| `toast.add(options)` | Add one |
| `toast.remove(id)` / `toast.close(id)` | Remove |
| `toast.clear()` / `toast.closeAll()` / `toast.destroyAll()` | Clear all |
| `toast.setDefaults({ position, max })` | Default corner and concurrency cap |

A string argument is treated as `summary`. Default `life` is `3000`; use `0` to keep open.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `ToastMessage[]` | — | Controlled list; omit to bind the `toast` service queue |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Container placement |
| `max` | `number` | — | Max visible items; oldest is dropped (service queue only) |
| `teleport` | `boolean` | `true` | Whether to Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target |
| `transition` | `string \| false` | `'slide-fade'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | Pass-through; see [Styling & attrs](/docs/attrs). |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `ToastMessage` | Close clicked; remove it yourself in controlled mode |

## Slots

No slots; driven by the `messages` prop or toast API.

## Types

<h4 id="ToastMessage">ToastMessage</h4>

See source `types.ts` for the full definition.

```ts
interface ToastMessage {
  id: string | number
  summary: MRenderable
  detail?: MRenderable
  severity?: ToastSeverity
  closable?: boolean
  /** Custom leading icon */
  icon?: IconName
  /** Action area rendered under the detail (usually buttons) */
  actions?: MRenderable
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
}
```

## Notification (useNotification / notification)

Matches Ant Design's `notification` surface and reuses the same toast service underneath, so every transient message shares one overlay host and motion stack:

```ts
import { notification, useNotification } from 'morya-ui'

const api = useNotification()

api.success({ message: 'Saved', description: 'All changes are stored.', duration: 3 })
api.open({ message: 'Background job', key: 'job', btn: h(MButton, {}, () => 'View') })
// Re-opening with the same key updates in place instead of stacking
api.open({ message: 'Done', key: 'job', type: 'success' })
```

| Method | Description |
| --- | --- |
| `open(options)` | Open one notification |
| `info` / `success` / `warning` / `error` | Type shortcuts |
| `close(key)` | Close by key |
| `destroy()` | Close all |

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `MRenderable` | — | Title |
| `description` | `MRenderable` | — | Body |
| `btn` | `MRenderable` | — | Action area |
| `icon` | `IconName` | — | Custom icon |
| `type` | `NotificationType` | `'info'` | Tone and default icon |
| `key` | `string \| number` | — | Unique key; passing it again updates in place |
| `duration` | `number` | `4.5` | Auto-close in **seconds** (`0` keeps it open) |
| `placement` | `NotificationPlacement` | `'topRight'` | `topLeft` / `topRight` / `bottomLeft` / `bottomRight` / `top` / `bottom` |
| `closable` | `boolean` | `true` | Show the close button |
| `onClose` | `() => void` | — | Called after closing |

> `duration` is in **seconds** (Ant Design convention), while the native `toast` API uses `life` in milliseconds.
