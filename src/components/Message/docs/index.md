---
title: Message
category: 05 / FEEDBACK
description: 顶部居中浮层提示，支持 API 调用。
---

# Message

从窗口顶部正中滑入的轻量提示（可通过 `placement` 改到六向位置），适合简短操作反馈。推荐用 `message` API；也可挂载 `<MMessage />` 作为自定义挂载点。

与 [Toast](/components/Toast) 的分工：

- **Message（默认）**：轻量单行反馈，默认顶部居中，无标题/详情。**大多数 CRUD / 保存 / 删除回执应使用此项。**
- **Toast**：四角通知，带 `summary` / `detail`；仅在有补充说明或异步通知感时使用。
- **`<MMessage>` 组件**：可选的 message 服务宿主（自定义 `appendTo` / `placement`）。它不是页面内嵌 Alert；表单常驻错误用字段 `errorMessage`，或 token 样式的 `role="alert"`。

> AI / 业务代码选型细则见 [`feedback.md`](../../../../design-kit/.agents/skills/morya-ui-pages/references/feedback.md)。

**快速判断**：只有一句话 → `message.success('已保存')`；有标题 + 详情 → `toast.success({ summary, detail })`。

## 引入

```ts
import { message, MMessage, useMessage } from 'morya-ui'
```

## API

首次调用时会自动挂载浮层容器，无需在模板里放置组件。

```vue preview src="./demos/Api.zh.vue"
```

## 自定义内容

`content`（以及 Toast 的 `summary` / `detail`）支持字符串、`h()` 返回的 VNode、组件，或 `() => VNode` 工厂函数。

```vue preview src="./demos/CustomContent.zh.vue"
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
| `message.closeAll()` / `message.destroyAll()` | 关闭全部（二者等价） |
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
<MMessage append-to="body" />
```

存在手动宿主时，API 不会再自动挂载第二份。

## Props（`MMessage`）

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `teleport` | `boolean` | `true` | 是否 Teleport |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标 |
| `transition` | `string \| false` | `'message'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `placement` | `'top' \| 'top-left' \| 'top-right' \| 'bottom' \| 'bottom-left' \| 'bottom-right'` | `'top'` | 宿主位置 |
| `max` | `number` | — | 同时可见条数；超出丢掉最旧一条 |
| `auto` | `boolean` | — | — |
| `messages` | `MessageItem[]` | — | — |

## Events

`<MMessage />` 宿主本身无 Vue 事件；请通过 `message.*` API 的返回值 `{ id, close }` 管理生命周期。

## Slots

无插槽；通过 `message.*` API 注入内容。

## 类型

<h4 id="MessageItem">MessageItem</h4>

完整定义见源码 `types.ts`。

```ts
interface MessageItem {
  id: string | number
  content: MRenderable
  severity?: MessageSeverity
  closable?: boolean
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
  icon?: boolean
}
```
