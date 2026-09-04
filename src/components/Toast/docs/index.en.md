---
title: Toast
category: 05 / FEEDBACK
description: Corner floating notifications with API and controlled lists.
---

# Toast

Corner notifications with a title and optional detail. Use the `toast` API, or keep rendering with a controlled `:messages` list.

Vs [Message](/components/Message): Message is the **default** for short single-line feedback; Toast is for `summary` / `detail` or corner notifications. `max` applies to the service queue only.

> Selection guide: [`feedback-message-vs-toast.md`](../../../../ai-design-config/docs/feedback-message-vs-toast.md).

Do **not** use `toast.add({ summary: 'Saved' })` when `message.success('Saved')` is enough.

## Import

```ts
import { toast, useToast, WdToast } from '@wex-design/ui'
```

## API

```vue preview
<script setup lang="ts">
import { toast, WdButton } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton
      label="Success"
      severity="success"
      @click="toast.success({ summary: 'Saved', detail: 'Your changes are live.' })"
    />
    <WdButton
      label="Info"
      severity="info"
      @click="toast.info({ summary: 'Tip', detail: 'You can continue.' })"
    />
    <WdButton
      label="Warn"
      severity="warn"
      @click="toast.warn({ summary: 'Caution', detail: 'Please double-check.' })"
    />
    <WdButton
      label="Error"
      severity="danger"
      @click="toast.error({ summary: 'Failed', detail: 'Try again later.' })"
    />
  </div>
</template>
```

## Custom content

`summary` / `detail` also accept strings, `h()` VNodes, components, or render factories.

```vue preview
<script setup lang="ts">
import { toast, WdButton } from '@wex-design/ui'
import { h } from 'vue'

function showRich() {
  toast.info({
    summary: () => h('span', [h('strong', 'Custom title')]),
    detail: () => h('em', 'Detail can be a VNode too'),
    life: 4000,
  })
}
</script>

<template>
  <WdButton label="Rich Toast" @click="showRich" />
</template>
```

## Controlled

You can still manage the list yourself with `messages` + `close`.

```vue preview
<script setup lang="ts">
import type { ToastMessage } from '@wex-design/ui'
import { WdButton, WdToast } from '@wex-design/ui'
import { ref } from 'vue'

const messages = ref<ToastMessage[]>([])
let seq = 0

function push(severity: ToastMessage['severity'], summary: string, detail?: string) {
  messages.value = [
    ...messages.value,
    { id: `toast-${++seq}`, summary, detail, severity, life: 0 },
  ]
}

function onClose(message: ToastMessage) {
  messages.value = messages.value.filter((item) => item.id !== message.id)
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdButton label="Success" severity="success" @click="push('success', 'Saved', 'Your changes are live.')" />
    <WdButton label="Info" severity="info" @click="push('info', 'Tip', 'Something to know.')" />
  </div>
  <WdToast :messages="messages" position="top-right" @close="onClose" />
</template>
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

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `close` | `ToastMessage` | Close clicked; remove it yourself in controlled mode |

## Slots

No slots; driven by the `messages` prop or toast API.
