---
title: ProgressBar
category: 07 / MISC
description: 进度条用于展示确定或不确定进度。
---

# ProgressBar

进度条用于展示任务完成比例，或不确定加载态。

## 引入

```ts
import { WdProgressBar } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdProgressBar } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WdProgressBar :value="35" />
    <WdProgressBar :value="70" :show-value="false" />
    <WdProgressBar mode="indeterminate" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 进度 0–100（determinate）。 |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | 确定 / 不确定模式。 |
| `showValue` | `boolean` | `true` | 是否显示百分比文案。 |
