---
title: Tree
category: 03 / DATA
description: 树形结构。支持勾选半选、过滤、受控展开、懒加载与拖拽。
---

# Tree

层级节点树，支持展开、勾选、过滤与拖拽等常用能力。

默认插槽 `{ node, data }` 可自定义节点内容。`checkStrategy` 为 `'all' | 'parent' | 'child'`（`checkStrictly` 时忽略）。内部仍按级联计算半选；`v-model:checked-keys` 按策略投影。虚拟滚动本期不做。

## 引入

```ts
import { MTree } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Checkbox

```vue preview src="./demos/Checkbox.zh.vue"
```

## Check strategy

勾选父节点时，`check-strategy="child"` 只绑定叶子 key。

```vue preview src="./demos/CheckStrategy.vue"
```

## Filter

```vue preview src="./demos/Filter.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `TreeNode[]` | — | 节点树。 |
| `modelValue` / `selectionKeys` / `selectionMode` | — | — | 高亮选择。 |
| `showCheckbox` / `checkedKeys` / `checkStrictly` / `checkStrategy` | — | `'all'` | `checkStrategy` 默认 `'all'`；`'parent'` / `'child'` 只改变绑定的 keys。 |
| `expandedKeys` / `defaultExpandAll` / `accordion` | — | — | 展开控制。 |
| `filter` / `filterNode` | — | — | 过滤。 |
| `lazy` / `load` | — | — | 懒加载子节点。 |
| `draggable` | `boolean` | `false` | 拖拽；落点通过 `node-drop` 由业务改树。 |
| `emptyMessage` | `string` | — | 无数据时的提示文案。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots / Events

| 插槽 | 说明 |
| --- | --- |
| `default` | `{ node, data }` 自定义节点内容。 |

| 事件 | 说明 |
| --- | --- |
| `update:checkedKeys` / `update:expandedKeys` / `check` / `node-expand` / `node-collapse` / `node-drop` | 交互回调。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `node-select` | `TreeNode` | 节点选中。 |
| `node-expand` | `TreeNode` | 节点展开。 |
| `node-collapse` | `TreeNode` | 节点收起。 |
| `node-load-error` | `{ node, error }` | 懒加载子节点失败。 |
| `node-unselect` | `TreeNode` | 取消选中节点。 |
| `update:modelValue` | `TreeNodeKey \| TreeNodeKey[]` | 选中键 v-model。 |
| `update:selectionKeys` | `Record<string, boolean>` | 选中键集合 v-model。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `empty` | 自定义 `empty` 内容。 |

## 类型

<h4 id="TreeNode">TreeNode</h4>

`value` 数组项：

```ts
interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
  icon?: string
  disabled?: boolean
  isLeaf?: boolean
}
```

选中/勾选/展开分别用 `selectionKeys`、`checkedKeys`、`expandedKeys`（`Record<string, boolean>`）。`checkStrategy` 为 `'all' | 'parent' | 'child'`。更多见 [API 类型](/docs/types)。
