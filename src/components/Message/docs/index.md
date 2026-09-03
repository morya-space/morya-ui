---
title: Message
category: 05 / FEEDBACK
description: 顶部居中浮层提示，支持 API 调用。
---

# Message

从窗口顶部正中滑入的轻量提示（可通过 `placement` 改到六向位置），适合简短操作反馈。推荐用 `message` API；也可挂载 `<WiMessage />` 作为自定义挂载点。

与 [Toast](/components/Toast) 的分工：

- **Message（默认）**：轻量单行反馈，默认顶部居中，无标题/详情。**大多数 CRUD / 保存 / 删除回执应使用此项。**
- **Toast**：四角通知，带 `summary` / `detail`；仅在有补充说明或异步通知感时使用。
- **`<WiMessage>` 组件**：页面内嵌条，用于表单区常驻错误（见下方「内嵌 Message」）。

> AI / 业务代码选型细则见 [`feedback-message-vs-toast.md`](../../../../ai-design-config/docs/feedback-message-vs-toast.md)。

**快速判断**：只有一句话 → `message.success('已保存')`；有标题 + 详情 → `toast.success({ summary, detail })`。

## 引入

```ts
import { message, useMessage, WiMessage } from '@well-insight/ui'
```

## API

首次调用时会自动挂载浮层容器，无需在模板里放置组件。

```vue preview
<script setup lang="ts">
import { message, WiButton } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiButton label="Success" severity="success" @click="message.success('保存成功')" />
    <WiButton label="Info" severity="info" @click="message.info('这是一条提示')" />
    <WiButton label="Warn" severity="warn" @click="message.warn('请核对后再提交')" />
    <WiButton label="Error" severity="danger" @click="message.error('请求失败，请重试')" />
    <WiButton
      label="Closable"
      @click="message.info({ content: '可手动关闭', closable: true, life: 0 })"
    />
  </div>
</template>
```

## 自定义内容

`content`（以及 Toast 的 `summary` / `detail`）支持字符串、`h()` 返回的 VNode、组件，或 `() => VNode` 工厂函数。

```vue preview
<script setup lang="ts">
import { message, WiButton, WiIcon } from '@well-insight/ui'
import { h } from 'vue'

function showVNode() {
  message.info({
    content: () =>
      h('span', [
        h(WiIcon, { name: 'check-circle', size: 'sm' }),
        ' 已用 ',
        h('strong', 'h()'),
        ' 渲染',
      ]),
    life: 4000,
  })
}
</script>

<template>
  <WiButton label="VNode 内容" @click="showVNode" />
</template>
```

## Methods

| 方法 | 说明 |
| --- | --- |
| `message.success(content \| options)` | 成功提示 |
| `message.info(content \| options)` | 信息提示 |
| `message.warn(content \| options)` | 警告提示（`warning` 同义） |
| `message.error(content \| options)` | 错误提示 |
| `message.open(content \| options)` | 自定义打开 |
| `message.close(id?)` | 关闭指定 / 全部 |
| `message.closeAll()` / `message.destroyAll()` | 关闭全部（`destroyAll` 对齐 Naive） |
| `message.config({ placement, max })` | 宿主位置与并发上限 |

返回值：`{ id, close }`。

### MessageOptions

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string \| number \| VNode \| Component \| (() => VNodeChild)` | — | 正文；也可把可渲染值直接当作入参 |
| `severity` | `'success' \| 'info' \| 'warn' \| 'error' \| 'secondary' \| 'contrast'` | `'info'` | 语义色 |
| `closable` | `boolean` | `false` | 显示关闭按钮 |
| `life` | `number` | `3000` | 自动关闭毫秒；`0` 不自动关闭 |
| `icon` | `boolean` | `true` | 显示语义图标 |
| `id` | `string \| number` | 自动生成 | 唯一键 |

## 可选宿主

需要自定义 `appendTo` 时，可在应用根部放置：

```vue
<WiMessage append-to="body" />
```

存在手动宿主时，API 不会再自动挂载第二份。

## Props（`WiMessage`）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `teleport` | `boolean` | `true` | 是否 Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标 |
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | 宿主位置 |
| `max` | `number` | — | 同时可见条数；超出丢掉最旧一条 |
| `auto` | `boolean` | — | — |
| `messages` | `MessageItem[]` | — | — |

## Events

`<WiMessage />` 宿主本身无 Vue 事件；请通过 `message.*` API 的返回值 `{ id, close }` 管理生命周期。

## Slots

无插槽；通过 `message.*` API 注入内容。
