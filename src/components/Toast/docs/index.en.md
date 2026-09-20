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

### ToastMessage

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| number` | — | Unique key |
| `summary` | `string \| number \| VNode \| Component \| (() => VNodeChild)` | — | Title |
| `detail` | same as above | — | Detail |
| `severity` | `'success' \| 'info' \| 'warn' \| 'error' \| …` | `'info'` | Tone |
| `closable` | `boolean` | `true` | Close button |
| `life` | `number` | API default `3000` | Auto-close ms |
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
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
}
```
