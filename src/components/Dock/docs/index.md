---
title: Dock
category: 09 / MENU
description: macOS 风格图标坞。
---

# Dock

以图标列表展示快捷入口。

## 引入

```ts
import { WiDock } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiDock } from '@well-insight/ui'

const model = [
  { label: '主页', icon: '⌂' },
  { label: '搜索', icon: '⌕' },
  { label: '设置', icon: '⚙' },
]
</script>

<template>
  <WiDock :model="model" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `model` | `DockItem[]` | `[]` | 图标项。 |
| `position` | `'bottom' \| 'top'` | `'bottom'` | 视觉位置修饰。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 停靠项。 |
