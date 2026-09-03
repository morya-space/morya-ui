---
title: Toast
category: 05 / FEEDBACK
description: 四角浮层通知，支持 API 与受控列表。
---

# Toast

带标题 / 详情的四角通知。可用 `toast` API，或继续用 `:messages` 受控渲染。

与 [Message](/components/Message) 的分工：Message 是轻量单行反馈；Toast 是带 `summary` / `detail` 的角落通知。受控 `:messages` 时请自行限制条数，`max` 只作用于服务队列。

## 引入

```ts
import { toast, useToast, WiToast } from '@well-insight/ui'
```

## API

```vue preview
<script setup lang="ts">
import { toast, WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiButton
      label="Success"
      severity="success"
      @click="toast.success({ summary: '已保存', detail: '变更已生效。' })"
    />
    <WiButton
      label="Info"
      severity="info"
      @click="toast.info({ summary: '提示', detail: '可以继续操作。' })"
    />
    <WiButton
      label="Warn"
      severity="warn"
      @click="toast.warn({ summary: '注意', detail: '请再核对一次。' })"
    />
    <WiButton
      label="Error"
      severity="danger"
      @click="toast.error({ summary: '失败', detail: '请稍后重试。' })"
    />
  </div>
</template>
```

## 自定义内容

`summary` / `detail` 同样支持字符串、`h()`、组件或渲染工厂。

```vue preview
<script setup lang="ts">
import { toast, WiButton } from '@well-insight/ui'
import { h } from 'vue'

function showRich() {
  toast.info({
    summary: () => h('span', [h('strong', '自定义标题')]),
    detail: () => h('em', '详情也可以是 VNode'),
    life: 4000,
  })
}
</script>

<template>
  <WiButton label="富文本 Toast" @click="showRich" />
</template>
```

## Controlled

仍可通过 `messages` + `close` 自行管理列表。

```vue preview
<script setup lang="ts">
import type { ToastMessage } from '@well-insight/ui'
import { WiButton, WiToast } from '@well-insight/ui'
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
    <WiButton label="Success" severity="success" @click="push('success', 'Saved', 'Your changes are live.')" />
    <WiButton label="Info" severity="info" @click="push('info', 'Tip', 'Something to know.')" />
  </div>
  <WiToast :messages="messages" position="top-right" @close="onClose" />
</template>
```

## Methods

| 方法 | 说明 |
| --- | --- |
| `toast.success / info / warn / error` | 按语义添加 |
| `toast.add(options)` | 添加一条 |
| `toast.remove(id)` / `toast.close(id)` | 移除 |
| `toast.clear()` / `toast.closeAll()` / `toast.destroyAll()` | 清空 |
| `toast.setDefaults({ position, max })` | 默认角落位置与并发上限 |

字符串入参视为 `summary`。默认 `life` 为 `3000`；`0` 表示不自动关闭。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `messages` | `ToastMessage[]` | — | 受控列表；省略则绑定 `toast` 服务队列 |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | 容器定位 |
| `max` | `number` | — | 同时可见条数；超出丢掉最旧一条（仅服务队列） |
| `teleport` | `boolean` | `true` | 浮层 Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标 |

### ToastMessage

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string \| number` | — | 唯一键 |
| `summary` | `string \| number \| VNode \| Component \| (() => VNodeChild)` | — | 标题 |
| `detail` | 同上 | — | 详情 |
| `severity` | `'success' \| 'info' \| 'warn' \| 'error' \| …` | `'info'` | 语义色 |
| `closable` | `boolean` | `true` | 关闭按钮 |
| `life` | `number` | API 默认 `3000` | 自动关闭毫秒 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `close` | `ToastMessage` | 点击关闭；受控模式下由调用方移除 |

## Slots

无插槽；通过 `messages` prop 或 toast API 驱动。
