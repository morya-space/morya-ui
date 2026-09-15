---
title: Empty
category: 05 / FEEDBACK
description: 空状态：图标 / 插图 + 标题 + 说明 + 操作。
---

# Empty

用于列表无数据、筛选无结果、首次使用等场景。不要用错误色表达正常的无数据状态；接口失败请用 [Result](/components/Result) 或 Message。

## 引入

```ts
import { MEmpty } from 'morya-ui'
```

## 基础用法

未传 `title` 时使用 locale 的 `emptyMessage`。

```vue preview src="./demos/Basic.vue"
```

## 操作区

通过 `#extra`（或默认插槽）放置恢复动作。

```vue preview src="./demos/WithActions.zh.vue"
```

## 无结果

```vue preview src="./demos/NoResult.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | locale `emptyMessage` | 标题。 |
| `description` | `string` | — | 说明文案。 |
| `icon` | [IconName](/docs/types#IconName) | `'database'` | 视觉锚点图标；有 `image` 时忽略。 |
| `image` | `string` | — | 插图 URL，优先于 `icon`。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `icon` | 自定义图标区。 |
| `image` | 自定义插图区。 |
| `title` | 自定义标题。 |
| `description` | 自定义说明。 |
| `extra` | 操作区。 |
| `default` | 同 `extra`，追加在操作区。 |

## 无障碍

- 根节点使用 `role="status"`。
- 装饰性图标 / 插图使用 `aria-hidden`；操作按钮需有可见文案。

## Events

无自定义事件。
