---
title: Calendar
category: 05 / DATA DISPLAY
description: 按日/月面板展示日期，支持卡片模式与单元格自定义。
---

# Calendar

**日历面板**（日程、排班、活动月视图）。日期解析与 `MDatePicker` 共用 `dateUtils`；星期与月份文案来自 `useMLocale`。


## 何时使用

- 按日/月面板展示日期，支持卡片模式与单元格自定义。
- 优先组合文档中的 `M*` API；共性约定见 [Common Props](/docs/common-props)。

## 引入

```ts
import { MCalendar } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 卡片模式

`fullscreen={false}`（默认 `true`）为全屏日历；关闭后为紧凑卡片。

```vue preview src="./demos/Card.vue"
```

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` / `v-model` | `Date \| string \| null` | `null` | 选中日期 |
| `mode` / `v-model:mode` | `'month' \| 'year'` | `'month'` | `month` = 日网格，`year` = 月网格 |
| `fullscreen` | `boolean` | `true` | `false` 为卡片紧凑样式 |
| `showWeek` | `boolean` | `false` | 显示 ISO 周数列 |
| `disabledDate` | `(date: Date) => boolean` | — | 禁用日期 |
| `validRange` | `[Date \| string, Date \| string]` | — | 可选范围 |
| `pt` | `RootPassThrough` | — | 根节点透传 |

## Events

| 事件 |  payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `Date \| string \| null` | 选中变化 |
| `update:mode` | `'month' \| 'year'` | 面板模式 |
| `select` | `Date` | 点击日期/月份 |
| `panelChange` | `Date`, `mode` | 面板日期或模式变化 |
| `change` | 同 `modelValue` | 值变化 |

## Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `header` | `{ value, mode, onChange, onModeChange }` | 自定义头部 |
| `dateCell` | `{ date }` | 日单元格内容区 |
| `monthCell` | `{ date }` | 月单元格内容区 |

未单独暴露整格渲染 API：需要完全自定义单元格时可在 `dateCell` 内自行布局整格。

