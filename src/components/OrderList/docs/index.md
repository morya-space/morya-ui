---
title: OrderList
category: 03 / DATA
description: 列表拖拽与上下按钮排序。
---

# OrderList

支持拖拽手柄重排（原生 HTML5 DnD，无外部拖拽库），并保留上下/置顶/置底按钮作为键盘友好备选。

## 引入

```ts
import { MOrderList } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## 禁用

```vue preview src="./demos/Disabled.zh.vue"
```

## 自定义项

通过 `#item` 插槽自定义渲染，作用域含 `{ item, index, selected, dragging }`。

```vue preview src="./demos/CustomItem.zh.vue"
```

## 键盘操作

| 按键 | 说明 |
| --- | --- |
| `↑` / `↓` | 移动选中项高亮。 |
| `Ctrl/⌘ + ↑` / `Ctrl/⌘ + ↓` | 将选中项上移 / 下移一位。 |
| `Ctrl/⌘ + Home` / `Ctrl/⌘ + End` | 将选中项置顶 / 置底。 |
| `Home` / `End` | 高亮首项 / 末项。 |

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `unknown[]` | `[]` | 列表数据。 |
| `selection` | `number \| null` | — | 受控选中下标，配合 `v-model:selection`。 |
| `dataKey` | `string` | — | 对象项的唯一键。 |
| `listStyle` | `string \| object` | — | 列表样式。 |
| `dragdrop` | `boolean` | `true` | 是否启用拖拽。 |
| `disabled` | `boolean` | `false` | 禁用全部交互（按钮、拖拽、选中）。 |
| `emptyMessage` | `string` | — | 空态文案，默认取 locale `emptyMessage`。 |
| `pt` | [OrderListPassThrough](/docs/types#OrderListPassThrough) | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | `{ item, index, selected, dragging }` 自定义项。 |
| `empty` | 自定义空态内容。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `unknown[]` | 顺序变化后的新数组。 |
| `update:selection` | `number \| null` | 选中下标变化。 |
| `reorder` | `{ item, from, to }` | 单次移动的详情（移动项、原下标、新下标）。 |

## 无障碍

- 列表为 `role="listbox"`，项为 `role="option"`，选中项同步 `aria-selected`。
- 拖拽仅在手柄 `pointerdown` 后启动，避免误触；键盘可完整完成所有排序操作。
- `disabled` 时列表标记 `aria-disabled`，项不可聚焦、不可拖拽。
