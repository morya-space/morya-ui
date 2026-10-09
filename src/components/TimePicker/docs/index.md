---
title: TimePicker
category: 02 / FORM
description: 独立时间选择入口；内部等价于 `MDatePicker` 的 `type="time"`。
---

# TimePicker

只选择时分（可选秒）的时间选择器。实现上是对 `MDatePicker` 的薄封装，`type` 固定为 `time`。

## 何时使用

- 表单里只要「时刻」，不需要日期网格
- 想从组件总览 / 搜索直接找到 TimePicker（而不是翻 DatePicker 类型章节）
- 优先用本组件；仍可用 `MDatePicker type="time"`

与 `MDatePicker` 的边界：日期、日期时间、范围请继续用 [DatePicker](/components/DatePicker)。

## 引入

```ts
import { MTimePicker } from 'morya-ui'
```

## 基础用法

值为 `HH:mm`；`showSeconds` 时为 `HH:mm:ss`。

```vue preview src="./demos/Basic.zh.vue"
```

## Props

继承 [DatePicker](/components/DatePicker) 除 `type` 外的 props（`type` 固定为 `time`）。常用：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| null` | `null` | `HH:mm` 或含秒时 `HH:mm:ss` |
| `showSeconds` | `boolean` | `false` | 是否包含秒列 |
| `format` | `string` | `'HH:mm'` | 输入框展示格式 |
| `label` | `string` | — | 标签 |
| `placeholder` | `string` | locale | 占位（默认 `timePickerPlaceholder`） |
| `clearable` | `boolean` | `true` | 清除按钮 |
| `fluid` | `boolean` | `false` | 通栏 |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | 尺寸 |
| `disabled` / `invalid` | `boolean` | `false` | 禁用 / 校验失败 |
| `teleport` / `appendTo` | — | 同 DatePicker | 面板挂载 |
| `transition` | `string \| false` | `'scale-fade'` | 动效 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| Date \| null` | 值变化。 |
| `change` | `string \| Date \| null` | 选择完成。 |
| `clear` | — | 点击清除。 |
| `show` | — | 面板打开。 |
| `hide` | — | 面板关闭。 |

## FAQ

### 和 `MDatePicker type="time"` 有何区别？

行为一致。`MTimePicker` 只是独立入口与更清晰的类型（无 `type` prop），便于文档站与按需引入。

### 何时用本组件？

只需要时间（无日期）时用它，API 更窄（`size` / `showSeconds` 等）。
