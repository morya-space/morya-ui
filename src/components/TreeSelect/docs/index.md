---
title: TreeSelect
category: 02 / FORM
description: 下拉树选择。支持单选/多选、勾选级联、过滤、清空与路径展示。
---

# TreeSelect

在下拉中展示可展开树。`multiple` / `checkable` 打开多选；另支持 `filterable`、`clearable`、`showPath`。

## 引入

```ts
import { MTreeSelect } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Multiple / filter / path

```vue preview src="./demos/MultipleFilterPath.zh.vue"
```

## Size

```vue preview src="./demos/Size.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `TreeSelectNode[]` | — | 树节点。 |
| `modelValue` | `string \| string[] \| null` | `null` | 选中节点 key；多选为数组。 |
| `placeholder` | `string` | locale | 占位文案。 |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `checkable` | `boolean` | `false` | 显示勾选框（级联语义同 Tree）。 |
| `checkStrictly` | `boolean` | `false` | 父子不关联。 |
| `checkStrategy` | `'all' \| 'parent' \| 'child'` | `'all'` | 级联时绑定哪些 keys。 |
| `clearable` | `boolean` | `false` | 显示清空。 |
| `filterable` | `boolean` | `false` | 面板内过滤。 |
| `showPath` | `boolean` | `false` | 展示祖先路径。 |
| `separator` | `string` | `' / '` | 路径分隔符。 |
| `maxTagCount` | `number` | — | 多选最多展示的 tag 数。 |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | 兼容字段；请优先用 `multiple`。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `id` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `label` | `string` | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| string[] \| null` | 选中变化。 |
| `clear` | — | 点击清空。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `value` | 触发器展示。 |
| `option` | 树节点 `{ node }`。 |

## 类型

<h4 id="TreeSelectNode">TreeSelectNode</h4>

完整定义见源码 `types.ts`。

```ts
interface TreeSelectNode {
  key: string
  label: string
  children?: TreeSelectNode[]
  disabled?: boolean
}
```
