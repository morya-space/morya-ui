---
title: Statistic
category: 05 / DATA DISPLAY
description: 数字指标展示，支持前缀后缀与倒计时。
---

# Statistic

**指标数字**展示（仪表盘、详情页摘要）。基于 `--m-*` 排版 token；加载态使用 `MSkeleton`。

## 引入

```ts
import { MStatistic, MStatisticCountdown } from 'morya-ui'
// 或 MStatistic.Countdown
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## 倒计时

`MStatisticCountdown`（或 `MStatistic.Countdown`）按 `format` 渲染剩余时间，结束时触发 `finish`。

```vue preview src="./demos/Countdown.vue"
```

## Props — Statistic

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | 标题 |
| `value` | `number \| string` | `0` | 数值 |
| `precision` | `number` | — | 小数位 |
| `prefix` / `suffix` | `string` | — | 前后缀 |
| `valueStyle` | `CSSProperties` | — | 数值行样式 |
| `loading` | `boolean` | `false` | 骨架屏 |
| `formatter` | `(value) => string` | — | 自定义格式化 |
| `decimalSeparator` | `string` | `'.'` | 小数点 |
| `groupSeparator` | `string` | `','` | 千分位 |
| `pt` | `RootPassThrough` | — | 透传根节点 |

## Props — Countdown

继承 Statistic（除 `formatter` / `value` 展示逻辑），额外：

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `number \| string \| Date` | — | 目标时间 |
| `format` | `string` | `'HH:mm:ss'` | 倒计时格式（`H/m/s` 等） |

## Events — Countdown

| 事件 | 说明 |
| --- | --- |
| `finish` | 倒计时结束 |
| `change` | 剩余毫秒变化 |

