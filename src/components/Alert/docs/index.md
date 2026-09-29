---
title: Alert
category: 05 / FEEDBACK
description: 页面内嵌常驻提示，支持语义色、关闭与操作区。
---

# Alert

页面内**常驻**反馈条，适合表单顶部说明、权限提示、只读页警告等。短暂操作回执请用 [Message](/components/Message) / [Toast](/components/Toast)；整页结果用 [Result](/components/Result)。


## 何时使用

- 页面内嵌常驻提示，支持语义色、关闭与操作区。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MAlert } from 'morya-ui'
```

## 基础用法

`severity` 控制语义色与默认图标：`info` / `success` / `warning` / `error`。

```vue preview src="./demos/Basic.vue"
```

## 可关闭

`closable` 显示关闭按钮；点击后触发 `close` 并卸载内容。

```vue preview src="./demos/Closable.vue"
```

## 操作区

`#action` 放置次要操作（如撤销）；`#title` / 默认插槽可自定义标题与正文。

```vue preview src="./demos/WithAction.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `severity` | `AlertSeverity` | `'info'` | 语义色与默认图标 |
| `title` | `string` | — | 标题 |
| `description` | `string` | — | 描述（也可用默认插槽） |
| `showIcon` | `boolean` | `true` | 是否显示图标 |
| `closable` | `boolean` | `false` | 是否可关闭 |
| `size` | `AlertSize` | — | 密度；也接受 `sm` / `lg` |
| `banner` | `boolean` | `false` | 通栏弱边框样式 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Events

| 事件 | 说明 |
| --- | --- |
| `close` | 点击关闭时触发 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 描述区 |
| `title` | 标题 |
| `icon` | 自定义图标 |
| `action` | 右侧操作 |

## 类型

### AlertSeverity

```ts
type AlertSeverity = 'info' | 'success' | 'warning' | 'error'
```

### AlertSize

```ts
type AlertSize = MSizeInput
```
