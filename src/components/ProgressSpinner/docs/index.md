---
title: ProgressSpinner
category: 07 / MISC
description: SVG 环形加载指示器，可配置描边宽度与动画时长。
---

# ProgressSpinner

SVG 环形加载指示器。

## 引入

```ts
import { WdProgressSpinner } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdProgressSpinner } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WdProgressSpinner />
    <WdProgressSpinner stroke-width="4" animation-duration="0.6s" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle 描边宽度。 |
| `animationDuration` | `string` | `'1s'` | 旋转动画时长。 |
| `ariaLabel` | `string` | `'加载中'` | 可访问名称。 |
