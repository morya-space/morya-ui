---
title: Result
category: 05 / FEEDBACK
description: 操作结果 / 阻断页：成功、失败、403、404 等。
---

# Result

用于提交成功、失败回执、权限不足或页面不存在等**流程终点**场景。无数据空态请用 [Empty](/components/Empty)。

## 引入

```ts
import { MResult } from 'morya-ui'
```

## 基础用法

`status` 决定默认图标、语义色与 locale 标题。

```vue preview src="./demos/Basic.zh.vue"
```

## 操作区

```vue preview src="./demos/Actions.zh.vue"
```

## HTTP 类状态

```vue preview src="./demos/Http.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `status` | `'success' \| 'info' \| 'warning' \| 'warn' \| 'error' \| 'danger' \| '403' \| '404' \| '500'` | `'info'` | 结果状态。`warn`→警告，`danger`→错误。 |
| `title` | `string` | 按 `status` 的 locale | 标题。 |
| `description` | `string` | — | 说明文案。 |
| `icon` | [IconName](/docs/types#IconName) | 按 `status` | 覆盖默认图标。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `icon` | 自定义图标区。 |
| `title` | 自定义标题。 |
| `description` | 自定义说明。 |
| `extra` | 操作区。 |
| `default` | 同 `extra`，追加在操作区。 |

## 无障碍

- 根节点使用 `role="status"`。
- 不要仅靠颜色表达结果；保持标题文案。

## Events

无自定义事件。
