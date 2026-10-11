---
title: DatePicker
category: 02 / FORM
description: 日历弹层选择日期、时间、月份或年份。单值或范围，字符串格式按 `type` 约定。支持 min/max、shortcuts、format、showSeconds、clearable。
---

# DatePicker

带月份导航与日网格的日期选择器；也可切换为时间列、月/年面板。

## 何时使用

- 需要选择日期、日期范围、日期时间、月或年时。
- 仅选时刻时优先使用独立入口 [TimePicker](/components/TimePicker)（仍可用 `type="time"`）。

## 引入

```ts
import { MDatePicker } from "morya-ui";
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

仅时间场景优先用独立组件 [TimePicker](/components/TimePicker)；本页 `type="time"` 仍可用。

`datetimerange`：两次点击选定日期后以两端 `00:00`（或 `00:00:00`）发出；面板保持打开时可用时间列调整终点时刻，点选最细粒度单位后关闭。

```vue preview src="./demos/Types.vue"
```

## Shortcuts

```vue preview src="./demos/Shortcuts.zh.vue"
```

## 范围快捷键

`shortcuts` 在 `daterange` / `datetimerange` 下更强大：返回 `[start, end]` 元组即可一键选定区间。与当前值匹配的快捷键会自动高亮。

```vue preview src="./demos/RangeShortcuts.zh.vue"
```

## 自定义格式

`format` 仅控制显示，提交值仍按 `type` 约定（`YYYY-MM-DD` 等）。支持任意 `YYYY` / `MM` / `DD` / `HH` / `mm` / `ss` 组合与自由文本。

```vue preview src="./demos/Format.zh.vue"
```

## 日期时间

`datetime` 与 `datetimerange` 把日历与时间列放在同一面板；`show-seconds` 含秒；`need-confirm` 让用户从容完成两步选择后再提交。

```vue preview src="./demos/Datetime.zh.vue"
```

## 自定义触发器

`#trigger` 插槽完全接管触发元素，作用域 `{ value, open }`。适合按钮、图标或复合排版。

```vue preview src="./demos/CustomTrigger.zh.vue"
```

## 禁用区间

`min-date` / `max-date` 之外的日期会在日历中置灰禁用。两者可单独或组合使用。

```vue preview src="./demos/DisabledDates.zh.vue"
```

## 内联面板

`:teleport="false"` + `append-to="self"` 让面板嵌入文档流，不浮出层叠上下文，适合卡片、抽屉或复合表单内嵌。

```vue preview src="./demos/InlinePanel.zh.vue"
```

## 面板模式切换

点击面板头部的月份/年份标签，可在 日 → 月 → 年 三个子面板间循环切换，方便快速跳到目标年份/月份再回到日视图。

## 状态（status）

`status` 提供 `'warning'` 与 `'error'` 两种视觉警示（`invalid` / `errorMessage` 会自动落到 `error`）。`warning` 通常配合 `helpText` 表达温和提醒，不阻断提交。

```vue preview src="./demos/Status.zh.vue"
```

## 页脚与自定义单元格

`#footer` 插槽在面板底部渲染操作区（作用域 `{ close }`）；`#cell` 插槽自定义日期单元格内容（作用域含 `date / inMonth / selected / inRange / rangeStart / rangeEnd / isToday / disabled`），适合加节假日标记、日程点、自定义排版。

```vue preview src="./demos/FooterAndCell.zh.vue"
```

## needConfirm 确认提交

`need-confirm` 启用后，选择值只写入暂存 draft，点击「确认」才提交并关闭，「取消」回滚。适合 `datetime` / `datetimerange` / `time` 等需要多步操作的场景。

```vue preview src="./demos/NeedConfirm.zh.vue"
```

## 多选日期

`multiple` 仅在 `type='date'` 下生效。`modelValue` 变为 `string[]`，每次点击切换选中，面板保持打开。

```vue preview src="./demos/Multiple.zh.vue"
```

## 多选实战：排班

多选配合 `MTag` 展示所选日期，直观易读。

```vue preview src="./demos/WorkSchedule.zh.vue"
```

## 表单集成

结合 `required` / `error-message` / `min-date`，实现一个完整的项目日期范围校验表单。

```vue preview src="./demos/FormIntegration.zh.vue"
```

## 输入掩码

`mask` 让输入框可编辑，按 `format` 自动插入 `-` `/` `:` 分隔符；`Enter` 提交，`Esc` 或失焦回滚。仅 `date` / `datetime` / `time` 类型支持。

```vue preview src="./demos/Mask.zh.vue"
```

## Props

| 参数           | 类型                                                                                    | 默认值         | 说明                                                                                        |
| -------------- | --------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| `modelValue`   | `string \| Date \| [string, string] \| null`                                            | `null`         | 按 `type`：`YYYY-MM-DD`、`[start,end]`、`YYYY-MM-DD HH:mm`、`HH:mm`、`YYYY-MM`、`YYYY` 等。 |
| `type`         | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange' \| 'time' \| 'month' \| 'year'` | `'date'`       | 面板与值格式。                                                                              |
| `showSeconds`  | `boolean`                                                                               | `false`        | `time` / `datetime` / `datetimerange` 是否含秒。                                            |
| `label`        | `string`                                                                                | —              | 标签。                                                                                      |
| `minDate`      | `string \| Date \| null`                                                                | —              | 可选下限。                                                                                  |
| `maxDate`      | `string \| Date \| null`                                                                | —              | 可选上限。                                                                                  |
| `placeholder`  | `string`                                                                                | locale         | 占位。                                                                                      |
| `format`       | `string`                                                                                | `'YYYY-MM-DD'` | 输入框展示格式（`YYYY`/`MM`/`DD`/`HH`/`mm`/`ss`）；提交值仍按 `type` 约定。                 |
| `clearable`    | `boolean`                                                                               | `true`         | 显示清除按钮。                                                                              |
| `shortcuts`    | `DatePickerShortcut[]`                                                                  | `[]`           | 面板快捷选项；与当前值匹配时高亮。                                                          |
| `status`       | `'default' \| 'warning' \| 'error'`                                                     | `'default'`    | 视觉警示；`invalid` / `errorMessage` 自动视为 `error`。                                     |
| `needConfirm`  | `boolean`                                                                               | `false`        | 选择后仅写入 draft，按「确认」提交、「取消」回滚。                                          |
| `multiple`     | `boolean`                                                                               | `false`        | 多选日期（仅 `type='date'`）；`modelValue` 为 `string[]`。                                  |
| `mask`         | `boolean`                                                                               | `false`        | 输入框可编辑，按 `format` 自动补分隔符；Enter 提交，Esc/失焦回滚。                          |
| `fluid`        | `boolean`                                                                               | `false`        | 宽度撑满。                                                                                  |
| `size`         | [MSizeInput](/docs/types#MSizeInput)                                                    | —              | `small` / `large`；可继承 ConfigProvider。                                                  |
| `disabled`     | `boolean`                                                                               | `false`        | 禁用。                                                                                      |
| `invalid`      | `boolean`                                                                               | `false`        | 校验失败态。                                                                                |
| `teleport`     | `boolean`                                                                               | `true`         | 面板 Teleport；默认挂到 `body`。                                                            |
| `appendTo`     | `string \| HTMLElement \| 'self' \| false`                                              | `'body'`       | 挂载目标；`'self'` / `false` 就地渲染。                                                     |
| `transition`   | `string \| false`                                                                       | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。                           |
| `errorMessage` | `string`                                                                                | —              | —                                                                                           |
| `helpText`     | `string`                                                                                | —              | —                                                                                           |
| `id`           | `string`                                                                                | —              | —                                                                                           |
| `pt`           | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }`  | —              | DOM 透传，见 [样式与 attrs](/docs/attrs).                                                   |

## Events

| 事件名              | 参数                                 | 说明             |
| ------------------- | ------------------------------------ | ---------------- |
| `update:modelValue` | `string \| [string, string] \| null` | 值变化。         |
| `clear`             | —                                    | 点击清除时触发。 |
| `change`            | —                                    | —                |
| `hide`              | —                                    | —                |
| `show`              | —                                    | —                |

## Slots

| 插槽名    | 说明                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `trigger` | 自定义触发器 `{ value, open }`。                                                                                                  |
| `footer`  | 面板底部自定义操作区，作用域 `{ close }`。`need-confirm` 时若未提供则显示默认「取消/确认」。                                       |
| `cell`    | 自定义日期单元格，作用域 `{ date, inMonth, selected, inRange, rangeStart, rangeEnd, isToday, disabled }`。                         |

## 类型

<h4 id="DatePickerShortcut">DatePickerShortcut</h4>

完整定义见源码 `types.ts`。

```ts
interface DatePickerShortcut {
  label: string;
  value:
    | DatePickerDateValue
    | [DatePickerDateValue, DatePickerDateValue]
    | (() => DatePickerDateValue | [DatePickerDateValue, DatePickerDateValue]);
}
```

## 功能边界

用 `type` 区分日期/范围/时间模式（含 `daterange`、`datetime`、`time` 等）。
