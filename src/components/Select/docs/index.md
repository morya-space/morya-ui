---
title: Select
category: 02 / FORM
description: 表单选择器，支持多选标签、远程搜索、invalid、size、fluid、showClear、filter；选项禁用；与动作菜单 Dropdown 不同。
---

# Select

表单选择器，用于从选项列表中选择一个或多个值。

**与 Dropdown 的区别：** `MSelect` 是表单控件；动作菜单请使用 `MDropdown`。

## 引入

```ts
import { MSelect } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Clearable

`showClear`（或别名 `clearable`）在已选值时显示清除按钮。

```vue preview src="./demos/Clearable.vue"
```

## Invalid

```vue preview src="./demos/Invalid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Sizes

```vue preview src="./demos/Sizes.vue"
```

## Fluid

```vue preview src="./demos/Fluid.vue"
```

## Multiple

`multiple` 时 `v-model` 为数组；已选项以可移除标签展示。菜单在选择后保持打开。`maxTagCount` 可折叠多余标签。

```vue preview src="./demos/Multiple.vue"
```

## Tag

`tag` + `filter` 允许用当前筛选词创建选项（回车或点击「创建」行）。虚拟列表本批不做。

```vue preview src="./demos/Tag.vue"
```

## Remote

`remote` 关闭本地筛选，输入时发出 `search`。用 `loading` 表示异步进行中。

```vue preview src="./demos/Remote.vue"
```

## Empty

无选项或筛选无结果时展示空态文案；可用 `emptyMessage` 覆盖，否则读取 ConfigProvider `locale.emptyMessage`。

```vue preview src="./demos/Empty.zh.vue"
```

## Teleport

菜单默认 Teleport 到 `body`（`teleport` + `appendTo`）。设 `append-to="self"` 或 `teleport={false}` 可就地渲染。

```vue preview src="./demos/Teleport.vue"
```

## 样式与 attrs

除控件 **事件** 外，fallthrough attrs 落在外层 field 根；`@keydown` 等由内部 combobox 接收。`placeholder`、`name` 优先用 props。下拉位置用 `placement` / `appendTo`；改面板 DOM 用 `pt`（键名见 Props）。详见 [样式与 attrs](/docs/attrs)。

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number>` | — | 选中值；`multiple` 时为数组。 |
| `options` | [SelectOption](/docs/types#SelectOption)`[]` | — | 选项列表。 |
| `label` | `string` | — | 字段标签。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `placeholder` | `string` | — | 占位文案。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 表单必填辅助。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `fluid` | `boolean` | `false` | 宽度撑满容器。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `tag` | `boolean` | `false` | 允许用筛选词创建选项（需 `filter`）。 |
| `remote` | `boolean` | `false` | 关闭本地筛选，输入时发出 `search`。 |
| `loading` | `boolean` | `false` | 异步加载中。 |
| `maxTagCount` | `number` | — | 多选时最多展示的标签数，其余折叠为 +N。 |
| `showClear` | `boolean` | `false` | 有值时显示清除按钮。 |
| `clearable` | `boolean` | `false` | `showClear` 的别名。 |
| `emptyMessage` | `string` | — | 空选项文案；默认取 `locale.emptyOptions`。 |
| `filter` | `boolean` | `false` | 打开菜单时显示筛选输入。 |
| `teleport` | `boolean` | `true` | 菜单 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | 菜单对齐。 |
| `transition` | `string \| false` | `'scale-fade'` | 菜单进出场动效预设；`false` / `'none'` 关闭。见[主题 · 动效预设](/docs/guide/theme)。 |
| `id` | `string` | — | 控件 id。 |
| `errorMessage` | `string` | — | 校验错误文案；与 `invalid` 同时生效时优先展示。 |
| `name` | `string` | — | 辅助原生 name（存在隐藏 input 时）。 |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 分段透传（`root`、`control` 等）。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | [SelectModelValue](/docs/types#SelectModelValue) | 值变化。 |
| `change` | [SelectModelValue](/docs/types#SelectModelValue) | 选择完成或清除。 |
| `clear` | — | 点击清除时触发。 |
| `show` | — | 菜单打开。 |
| `hide` | — | 菜单关闭。 |
| `search` | `string` | 筛选词变化（`filter` / `remote`）。 |
| `create` | [SelectOption](/docs/types#SelectOption) `{ label, value, disabled? }` | `tag` 模式下创建了新选项。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `value` | 自定义触发器展示（单选）。 |
| `option` | 选项 `{ option }`。 |

## 类型

<h4 id="SelectOption">SelectOption</h4>

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

<h4 id="SelectModelValue">SelectModelValue</h4>

单选为 `string | number`；`multiple` 时为 `(string | number)[]`。详见 [API 类型](/docs/types#SelectModelValue)。
