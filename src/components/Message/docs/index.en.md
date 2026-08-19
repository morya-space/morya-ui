---
title: Message
category: 04 / OVERLAY
description: Top-center floating notice with an imperative API.
---

# Message

A lightweight notice that slides in from the top center — good for short action feedback. Prefer the `message` API; you can also mount `<WdMessage />` as a custom host.

Vs [Toast](/components/Toast):

- **Message**: top-center, single-line copy.
- **Toast**: corner notifications with a title and optional detail.

## Import

```ts
import { message, useMessage, WdMessage } from '@well-insight/ui'
```

## API

The first call auto-mounts a floating host; no template component is required.

```vue preview
<script setup lang="ts">
import { WdButton, message } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WdButton label="Success" severity="success" @click="message.success('Saved')" />
    <WdButton label="Info" severity="info" @click="message.info('A short tip')" />
    <WdButton label="Warn" severity="warn" @click="message.warn('Please double-check')" />
    <WdButton label="Error" severity="danger" @click="message.error('Request failed')" />
    <WdButton
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
import { h } from 'vue'
import { WdButton, WdIcon, message } from '@well-insight/ui'

function showVNode() {
  message.info({
    content: () =>
      h('span', [
        h(WdIcon, { name: 'check-circle', size: 'sm' }),
        ' Built with ',
        h('strong', 'h()'),
        ' render',
      ]),
    life: 4000,
  })
}
</script>

<template>
  <WdButton label="VNode content" @click="showVNode" />
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
| `message.closeAll()` | Close all |

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
<WdMessage append-to="body" />
```

When a manual host exists, the API will not mount a second one.

## Props (`WdMessage`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `teleport` | `boolean` | `true` | Whether to Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target |
