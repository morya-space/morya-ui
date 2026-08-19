---
title: Dock
category: 09 / MENU
description: macOS 风格图标坞。
---

# Dock

以图标列表展示快捷入口。

## 引入

```ts
import { WdDock } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdDock } from '@well-insight/ui'

const model = [
  { label: '主页', icon: '⌂' },
  { label: '搜索', icon: '⌕' },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <WdDock :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `DockItem[]` | `[]` | 图标项。 |
| `position` | `'bottom' \| 'top'` | `'bottom'` | 视觉位置修饰。 |
