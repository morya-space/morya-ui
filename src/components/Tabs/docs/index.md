---
title: Tabs
category: 04 / NAVIGATION
description: 标签页切换。支持 line/card、关闭/新增、extra 与溢出滚动。
---

# Tabs

标签页用于在同一视图内切换内容分区。

## 引入

```ts
import { MTabs } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Card / closable / extra

```vue preview src="./demos/CardClosableExtra.zh.vue"
```

标签过多超出容器时，两端会出现滚动按钮。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | 当前活动 tab。 |
| `tabs` | `TabItem[]` | — | 标签列表；支持 `disabled` / `closable`。 |
| `type` | `'line' \| 'card'` | `'line'` | 外观。 |
| `closable` | `boolean` | `false` | 显示关闭按钮；单项 `closable` 优先。 |
| `addable` | `boolean` | `false` | 显示新增按钮。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 活动项变化。 |
| `change` | `string` | 切换完成。 |
| `close` | `string` | 点击关闭。 |
| `add` | — | 点击新增。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面板内容，作用域 `{ activeValue }`。 |
| `extra` | 标签栏右侧额外内容。 |

## 类型

<h4 id="TabItem">TabItem</h4>

完整定义见源码 `types.ts`。

```ts
interface TabItem {
  label: string
  value: string
  disabled?: boolean
  /** When set, overrides the Tabs `closable` prop for this item. */
  closable?: boolean
}
```
