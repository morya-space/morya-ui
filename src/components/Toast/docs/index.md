---
title: Toast
category: 05 / FEEDBACK
description: 四角浮层通知，支持 API 与受控列表。
---

# Toast

带标题 / 详情的四角通知。可用 `toast` API，或继续用 `:messages` 受控渲染。

与 [Message](/components/Message) 的分工：Message 是**默认**的轻量单行反馈；Toast 仅在需要 `summary` / `detail` 或角落通知时使用。受控 `:messages` 时请自行限制条数，`max` 只作用于服务队列。

> AI / 业务代码选型细则见 [`feedback.md`](../../../../design-kit/.agents/skills/morya-ui-pages/references/feedback.md)。

**不要**用 `toast.add({ summary: '已保存' })` 代替 `message.success('已保存')`。


## 何时使用

- 四角浮层通知，支持 API 与受控列表。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MToast, toast, useToast } from 'morya-ui'
```

## API

```vue preview src="./demos/Api.zh.vue"
```

## 自定义内容

`summary` / `detail` 同样支持字符串、`h()`、组件或渲染工厂。

```vue preview src="./demos/CustomContent.zh.vue"
```

## Controlled

仍可通过 `messages` + `close` 自行管理列表。

```vue preview src="./demos/Controlled.vue"
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
| `auto` | `boolean` | — | — |
| `transition` | `string \| false` | `'slide-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `close` | `ToastMessage` | 点击关闭；受控模式下由调用方移除 |

## Slots

无插槽；通过 `messages` prop 或 toast API 驱动。

## 类型

<h4 id="ToastMessage">ToastMessage</h4>

完整定义见源码 `types.ts`。

```ts
interface ToastMessage {
  id: string | number
  summary: MRenderable
  detail?: MRenderable
  severity?: ToastSeverity
  closable?: boolean
  /** 自定义前置图标 */
  icon?: IconName
  /** 详情下方的操作区（通常是按钮） */
  actions?: MRenderable
  /** Auto-close delay in ms. `0` keeps it open. Default `3000` for API calls. */
  life?: number
}
```

## Notification（useNotification / notification）

对齐 antd `notification` 的接口形状，底层复用同一套 toast 服务（单一浮层宿主与动画栈）：

```ts
import { notification, useNotification } from 'morya-ui'

const api = useNotification()

api.success({ message: '已保存', description: '所有修改已写入', duration: 3 })
api.open({ message: '后台任务', key: 'job', btn: h(MButton, {}, () => '查看') })
// 同 key 再次 open 会原位更新，而不是堆叠新的一条
api.open({ message: '完成', key: 'job', type: 'success' })
```

| 方法 | 说明 |
| --- | --- |
| `open(options)` | 打开一条通知 |
| `info` / `success` / `warning` / `error` | 类型快捷方法 |
| `close(key)` | 按 key 关闭 |
| `destroy()` | 关闭全部 |

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` | `MRenderable` | — | 标题 |
| `description` | `MRenderable` | — | 正文 |
| `btn` | `MRenderable` | — | 操作区 |
| `icon` | `IconName` | — | 自定义图标 |
| `type` | `NotificationType` | `'info'` | 语义色调与默认图标 |
| `key` | `string \| number` | — | 唯一键；重复传入会原位更新 |
| `duration` | `number` | `4.5` | 自动关闭秒数（`0` 不自动关闭） |
| `placement` | `NotificationPlacement` | `'topRight'` | `topLeft` / `topRight` / `bottomLeft` / `bottomRight` / `top` / `bottom` |
| `closable` | `boolean` | `true` | 显示关闭按钮 |
| `onClose` | `() => void` | — | 关闭后回调 |

> `duration` 单位是**秒**（antd 习惯），而 `toast` 原生 API 的 `life` 是毫秒。
