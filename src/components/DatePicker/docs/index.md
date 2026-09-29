---
title: DatePicker
category: 02 / FORM
description: 日历弹层选择日期、时间、月份或年份。单值或范围，字符串格式按 `type` 约定。支持 min/max、shortcuts、format、showSeconds、clearable。
---

# DatePicker

带月份导航与日网格的日期选择器；也可切换为时间列、月/年面板。

## 引入

```ts
import { MDatePicker } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Size

```vue preview src="./demos/Size.vue"
```

## Min / Max

超出范围的日期在日历中禁用。

```vue preview src="./demos/MinMax.zh.vue"
```

## Invalid

```vue preview src="./demos/Invalid.zh.vue"
```

## Disabled

```vue preview src="./demos/Disabled.zh.vue"
```

## Fluid

```vue preview src="./demos/Fluid.zh.vue"
```

## Teleport

面板默认 Teleport 到 `body`。可用 `append-to="self"` 或 `teleport={false}` 就地渲染。

```vue preview src="./demos/Teleport.zh.vue"
```

## Range

`type="daterange"` 时先点起点、再点终点；值为 `[start, end]`（ISO 日期）。

```vue preview src="./demos/Range.zh.vue"
```

## 类型扩展

`type` 支持 `month` / `year` / `time` / `datetime` / `datetimerange`。`showSeconds` 控制是否包含秒。

`datetimerange`：两次点击选定日期后以两端 `00:00`（或 `00:00:00`）发出；面板保持打开时可用时间列调整终点时刻，点选最细粒度单位后关闭。

```vue preview src="./demos/Types.vue"
```

## Shortcuts

```vue preview src="./demos/Shortcuts.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| [string, string] \| null` | `null` | 按 `type`：`YYYY-MM-DD`、`[start,end]`、`YYYY-MM-DD HH:mm`、`HH:mm`、`YYYY-MM`、`YYYY` 等。 |
| `type` | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange' \| 'time' \| 'month' \| 'year'` | `'date'` | 面板与值格式。 |
| `showSeconds` | `boolean` | `false` | `time` / `datetime` / `datetimerange` 是否含秒。 |
| `label` | `string` | — | 标签。 |
| `minDate` | `string \| Date \| null` | — | 可选下限。 |
| `maxDate` | `string \| Date \| null` | — | 可选上限。 |
| `placeholder` | `string` | locale | 占位。 |
| `format` | `string` | `'YYYY-MM-DD'` | 输入框展示格式（`YYYY`/`MM`/`DD`/`HH`/`mm`/`ss`）；提交值仍按 `type` 约定。 |
| `clearable` | `boolean` | `true` | 显示清除按钮。 |
| `shortcuts` | `DatePickerShortcut[]` | `[]` | 面板快捷选项。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `teleport` | `boolean` | `true` | 面板 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `id` | `string` | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| [string, string] \| null` | 值变化。 |
| `clear` | — | 点击清除时触发。 |
| `change` | — | — |
| `hide` | — | — |
| `show` | — | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `trigger` | 自定义触发器 `{ value, open }`。 |

## 类型

<h4 id="DatePickerShortcut">DatePickerShortcut</h4>

完整定义见源码 `types.ts`。

```ts
interface DatePickerShortcut {
  label: string
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue])
}
```
