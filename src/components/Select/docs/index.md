---
title: Select
category: 02 / FORM
description: 表单选择器：mode="multiple" | "tags"、labelInValue、fieldNames、showSearch、allowClear、optionRender、popupRender。
---

# Select

表单选择器，用于从选项列表中选择一个或多个值。

**与 Dropdown 的区别：** `MSelect` 是表单控件；动作菜单请使用 `MDropdown`。


## 何时使用

- 表单选择器：mode="multiple" | "tags"、labelInValue、fieldNames、showSearch、allowClear、optionRender、popupRender

## 引入

```ts
import { MSelect } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Clearable

`allowClear` 在已选值时显示清除按钮。

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

## 多选与标签创建

`mode="multiple"` 时 `v-model` 为数组，已选项以可移除标签展示，菜单在选择后保持打开。
`mode="tags"` 在此基础上允许用当前搜索词创建选项（回车或点击「创建」行）。

```vue preview src="./demos/Multiple.vue"
```

```vue preview src="./demos/Tag.vue"
```

`maxTagCount` 折叠多余标签；折叠摘要由 `maxTagPlaceholder` 自定义，默认取 locale `moreTags`。

## labelInValue

打开后 `v-model` 与事件载荷为 `{ value, label }`：

```vue
<MSelect v-model="picked" label-in-value :options="options" />
```

## fieldNames

选项字段名不叫 `label` / `value` 时，用 `fieldNames` 重映射（支持分组子项）：

```vue
<MSelect :options="[{ title: 'Apple', id: 'apple' }]" :field-names="{ label: 'title', value: 'id' }" />
```

多余字段会被保留，因此 `optionFilterProp` 可以指向自定义键。

## Group

`options` 可混入 `{ label, options }` 分组（[SelectOptionGroup](/docs/types#SelectOptionGroup)），菜单显示分组标题行；分组本身不可选，搜索会按组内选项过滤并隐藏空组。

```vue preview src="./demos/Group.vue"
```

## 搜索与过滤

`showSearch` 在浮层中显示搜索输入。本地过滤规则：

- `filterOption` 省略 / `true`：按 `optionFilterProp`（默认 `label`）模糊匹配；
- `filterOption: false`：关闭本地过滤；
- `filterOption: (input, option) => boolean`：自定义谓词。

`remote` 跳过本地过滤并随输入发出 `search`（需配合 `showSearch`），用 `loading` 表示请求进行中。

```vue preview src="./demos/Remote.vue"
```

## 自定义选项渲染

- `optionRender(option)`：自定义每行内容（优先于 `option` 插槽）；
- `popupRender(menu)`：在浮层外层包一层自定义结构；
- `suffixIcon`：替换右侧箭头图标。

```vue preview src="./demos/HeaderFooter.vue"
```

## Empty

无选项或筛选无结果时展示空态文案；可用 `notFoundContent` 覆盖，否则读取 ConfigProvider `locale.emptyOptions`。

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
| `modelValue` | `string \| number \| Array<string \| number> \| SelectLabeledValue` | — | 选中值；`mode` 时数组，`labelInValue` 时为 `{ value, label }`。 |
| `options` | `Array<`[SelectOption](/docs/types#SelectOption)` \| `[SelectOptionGroup](/docs/types#SelectOptionGroup)`>` | — | 选项列表；可混入 `{ label, options }` 分组。 |
| `fieldNames` | `{ label?, value?, disabled?, options? }` | — | 重映射原始选项字段名。 |
| `labelInValue` | `boolean` | `false` | `v-model` / 事件返回 `{ value, label }`。 |
| `label` | `string` | — | 字段标签。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `status` | `'error' \| 'warning'` | — | 视觉校验态；`error` 等同 invalid，`warning` 为警告描边。 |
| `placeholder` | `string` | — | 占位文案。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 表单必填辅助。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；可继承 Form `size`。 |
| `variant` | `'outlined' \| 'filled'` | — | 输入面样式。 |
| `fluid` | `boolean` | `false` | 宽度撑满容器。 |
| `mode` | `'multiple' \| 'tags'` | — | 多选；`tags` 额外允许创建选项。 |
| `remote` | `boolean` | `false` | 关闭本地筛选，输入时发出 `search`。 |
| `loading` | `boolean` | `false` | 异步加载中。 |
| `maxTagCount` | `number` | — | 多选时最多展示的标签数，其余折叠。 |
| `maxTagPlaceholder` | `(omitted) => MRenderable` | locale `moreTags` | 折叠标签摘要。 |
| `allowClear` | `boolean` | `false` | 有值时显示清除按钮。 |
| `notFoundContent` | `MRenderable` | locale `emptyOptions` | 空选项 / 无匹配文案。 |
| `showSearch` | `boolean` | `false` | 浮层中显示搜索输入。 |
| `optionFilterProp` | `string` | `'label'` | 本地匹配读取的选项字段。 |
| `filterOption` | `boolean \| (input, option) => boolean` | 按 `optionFilterProp` 匹配 | 本地过滤规则；`false` 关闭。 |
| `optionRender` | `(option) => MRenderable` | — | 自定义选项行（优先于 `option` 插槽）。 |
| `popupRender` | `(menu) => VNodeChild` | — | 包裹浮层菜单。 |
| `suffixIcon` | `IconName` | `'chevron-down'` | 右侧图标。 |
| `teleport` | `boolean` | `true` | 菜单 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | 菜单对齐。 |
| `transition` | `string \| false` | `'scale-fade'` | 菜单进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `id` | `string` | — | 控件 id。 |
| `errorMessage` | `string` | — | 校验错误文案；与 `invalid` 同时生效时优先展示。 |
| `name` | `string` | — | 辅助原生 name（存在隐藏 input 时）。 |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 分段透传。 |
| `virtual` | `boolean` | 自动 | `true` 强制虚拟列表；`false` 关闭；默认选项 ≥80 时开启。 |

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
| `header` | 浮窗列表上方的自定义内容。 |
| `footer` | 浮窗列表下方的自定义内容。 |

## 类型

<h4 id="SelectOption">SelectOption</h4>

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

<h4 id="SelectOptionGroup">SelectOptionGroup</h4>

```ts
interface SelectOptionGroup {
  label: string
  items: SelectOption[]
}
```

<h4 id="SelectModelValue">SelectModelValue</h4>

单选为 `string | number`；`multiple` 时为 `(string | number)[]`。详见 [API 类型](/docs/types#SelectModelValue)。
