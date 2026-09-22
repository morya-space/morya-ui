---
title: Message
category: 05 / FEEDBACK
description: Top-center floating notice with an imperative API.
---

# Message

A lightweight notice that slides in from the top center by default (`placement` can move it). Prefer the `message` API; you can also mount `<MMessage />` as a custom host.

Vs [Toast](/components/Toast):

- **Message (default)**: short single-line feedback; no title/detail. Use for most CRUD / save / delete confirmations.
- **Toast**: corner notifications with `summary` / `detail`; use only when supplementary detail is needed.
- **`<MMessage>` component**: optional host for the `message` service (custom `appendTo` / `placement`). It is not an inline alert; persistent form errors use field `errorMessage` or a token-styled `role="alert"`.

> Selection guide: [`feedback.md`](../../../../design-kit/.agents/skills/morya-ui-pages/references/feedback.md).

**Rule of thumb**: one short sentence → `message.success('Saved')`; title + detail → `toast.success({ summary, detail })`.

## Import

```ts
import { message, MMessage, useMessage } from 'morya-ui'
```

## API

The first call auto-mounts a floating host; no template component is required.

```vue preview src="./demos/Api.en.vue"
```

## Custom content

`content` (and Toast `summary` / `detail`) accepts a string, a VNode from `h()`, a component, or a `() => VNode` factory.

```vue preview src="./demos/CustomContent.en.vue"
```

## Methods

| Method | Description |
| --- | --- |
| `message.success(content \| options)` | Success |
| `message.info(content \| options)` | Info |
| `message.warn(content \| options)` | Warn (`warning` alias) |
| `message.error(content \| options)` | Error |
| `message.open(content \| options)` | Open with options |
| `message.close(id?)` | Close one / all |
| `message.closeAll()` / `message.destroyAll()` | Close all (aliases of each other) |
| `message.config({ placement, max })` | Host placement and concurrency cap |

Returns `{ id, close }`.

### MessageOptions

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string \| number \| VNode \| Component \| (() => VNodeChild)` | — | Body; a renderable value may also be passed directly |
| `severity` | `'success' \| 'info' \| 'warn' \| 'error' \| 'secondary' \| 'contrast'` | `'info'` | Tone |
| `closable` | `boolean` | `false` | Show close button |
| `life` | `number` | `3000` | Auto-close ms; `0` keeps open |
| `icon` | `boolean` | `true` | Show severity icon |
| `id` | `string \| number` | auto | Unique key |

## Optional host

For a custom `appendTo`, place this at the app root:

```vue
<MMessage append-to="body" />
```

When a manual host exists, the API will not mount a second one.

## Props (`MMessage`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `teleport` | `boolean` | `true` | Whether to Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target |
| `transition` | `string \| false` | `'message'` | Enter/exit motion preset; `false` / `'none'` disables. See [Motion](/docs/motion). |
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | Host placement |
| `max` | `number` | — | Max visible items; oldest is dropped |

## Events

The `<MMessage />` host emits no Vue events. Use the `{ id, close }` return value from `message.*` APIs to control lifetime.

## Slots

No slots; content is injected through the `message.*` API.
