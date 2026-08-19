---
title: ScrollTop
category: 07 / MISC
description: 滚动超过阈值后显示回到顶部按钮。
---

# ScrollTop

监听窗口或父容器滚动，一键回到顶部。

## 引入

```ts
import { WdScrollTop } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdScrollTop } from '@well-insight/ui'
</script>

<template>
  <div style="height: 8rem; overflow: auto; position: relative">
    <div style="height: 40rem">向下滚动…</div>
    <WdScrollTop :threshold="80" target="parent" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `threshold` | `number` | `400` | 显示阈值（px）。 |
| `target` | `'window' \| 'parent'` | `'window'` | 滚动目标。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
