---
title: ProgressSpinner
category: 07 / MISC
description: SVG 环形加载指示器，可配置描边宽度与动画时长。
---

# ProgressSpinner

SVG 环形加载指示器。

## 引入

```ts
import { WiProgressSpinner } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiProgressSpinner } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center">
    <WiProgressSpinner />
    <WiProgressSpinner stroke-width="4" animation-duration="0.6s" />
  </div>
</template>
```

## Wrap

包裹内容时用 `show` 控制遮罩，`delay` 延迟出现。

```vue preview
<script setup lang="ts">
import { WiButton, WiProgressSpinner } from '@well-insight/ui'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <WiProgressSpinner :show="loading" description="Loading">
    <p style="margin:0">
      Form content
    </p>
  </WiProgressSpinner>
  <WiButton label="Toggle" size="small" @click="loading = !loading" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `strokeWidth` | `string` | `'2'` | SVG circle 描边宽度。 |
| `animationDuration` | `string` | `'1s'` | 旋转动画时长。 |
| `ariaLabel` | `string` | `'加载中'` | 可访问名称。 |
| `show` | `boolean` | `true` | 包裹内容时是否显示遮罩。 |
| `delay` | `number` | `0` | 显示前延迟（ms）。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `description` | `string` | — | 遮罩下方说明。 |

## Events

无自定义事件。

## Slots

无插槽。
