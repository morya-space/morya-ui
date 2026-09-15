---
title: ProgressBar
category: 03 / DATA
description: 进度条用于展示确定或不确定进度。
---

# ProgressBar

进度条用于展示任务完成比例，或不确定加载态。

## 引入

```ts
import { MProgressBar } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Circle & status

```vue preview src="./demos/CircleAndStatus.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 进度 0–100（determinate）。 |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | 确定 / 不确定模式。 |
| `showValue` | `boolean` | `true` | 是否显示百分比文案。 |
| `type` | `'line' \| 'circle'` | `'line'` | 线形或环形。 |
| `status` | `'success' \| 'info' \| 'warn' \| 'danger' \| 'error'` | — | 语义色。 |
| `color` | `string` | — | 自定义填充色。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

无插槽。
