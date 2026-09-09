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
- **`<MMessage>` component**: inline banner for persistent form/auth errors.

> Selection guide: [`feedback-message-vs-toast.md`](../../../../ai-design-config/docs/feedback-message-vs-toast.md).

**Rule of thumb**: one short sentence → `message.success('Saved')`; title + detail → `toast.success({ summary, detail })`.

## Import

```ts
import { message, useMessage, MMessage } from 'morya-ui'
```

## API

The first call auto-mounts a floating host; no template component is required.

```vue preview
<script setup lang="ts">
import { message, MButton } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <MButton label="Success" severity="success" @click="message.success('Saved')" />
    <MButton label="Info" severity="info" @click="message.info('A short tip')" />
    <MButton label="Warn" severity="warn" @click="message.warn('Please double-check')" />
    <MButton label="Error" severity="danger" @click="message.error('Request failed')" />
    <MButton
      label="Closable"
      @click="message.info({ content: 'Dismiss manually', closable: true, life: 0 })"
    />
  </div>
</template>
```

## Custom content

`content` (and Toast `summary` / `detail`) accepts a string, a VNode from `h()`, a component, or a `() => VNode` factory.

```vue preview
<script setup lang="ts">
import { message, MButton, MIcon } from 'morya-ui'
import { h } from 'vue'

function showVNode() {
  message.info({
    content: () =>
      h('span', [
        h(MIcon, { name: 'check-circle', size: 'sm' }),
        ' Built with ',
        h('strong', 'h()'),
        ' render',
      ]),
    life: 4000,
  })
}
</script>

<template>
  <MButton label="VNode content" @click="showVNode" />
</template>
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
| `message.closeAll()` / `message.destroyAll()` | Close all (`destroyAll` matches Naive) |
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
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | Host placement |
| `max` | `number` | — | Max visible items; oldest is dropped |

## Events

The `<MMessage />` host emits no Vue events. Use the `{ id, close }` return value from `message.*` APIs to control lifetime.

## Slots

No slots; content is injected through the `message.*` API.
