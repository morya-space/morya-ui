---
title: ScrollTop
category: 07 / MISC
description: 滚动超过阈值后显示回到顶部按钮。
---

# ScrollTop

监听窗口或父容器滚动，一键回到顶部。

## 引入

```ts
import { WiScrollTop } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiScrollTop } from '@well-insight/ui'
</script>

<template>
  <div style="height: 8rem; overflow: auto; position: relative">
    <div style="height: 40rem">
      向下滚动…
    </div>
    <WiScrollTop :threshold="80" target="parent" :right="16" :bottom="16" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | 显示阈值（px）。 |
| `target` | `'window' \| 'parent'` | `'window'` | 滚动目标。 |
| `right` | `string \| number` | — | 距右边缘；数字为 px。 |
| `bottom` | `string \| number` | — | 距底边缘；数字为 px。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

无自定义事件。

## Slots

无插槽。
