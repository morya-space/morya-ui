---
title: ProgressBar
category: 03 / DATA
description: 进度条用于展示确定或不确定进度。
---

# ProgressBar

进度条用于展示任务完成比例，或不确定加载态。

## 引入

```ts
import { WdProgressBar } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdProgressBar } from '@wex-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WdProgressBar :value="35" />
    <WdProgressBar :value="70" :show-value="false" />
    <WdProgressBar mode="indeterminate" />
  </div>
</template>
```

## Circle & status

```vue preview
<script setup lang="ts">
import { WdProgressBar } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WdProgressBar :value="72" type="circle" status="success" />
    <WdProgressBar :value="40" status="warn" />
  </div>
</template>
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

## Events

无自定义事件。

## Slots

无插槽。
