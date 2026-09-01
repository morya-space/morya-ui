---
title: Chip
category: 07 / MISC
description: 芯片用于展示标签化信息，可带图标、图片与移除操作。
---

# Chip

芯片用于展示简短标签信息，可选图标/图片与移除按钮。

## 引入

```ts
import { WiChip } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiChip } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WiChip label="Basic" />
    <WiChip label="With Icon" icon="check" />
    <WiChip label="Removable" removable />
    <WiChip label="Success" severity="success" size="small" />
    <WiChip label="Disabled" removable disabled />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 芯片文案。 |
| `icon` | `IconName` | — | 前置图标名称。 |
| `image` | `string` | — | 前置图片 URL（优先于 icon）。 |
| `removable` | `boolean` | `false` | 显示 × 移除按钮。 |
| `disabled` | `boolean` | `false` | 禁用交互。 |
| `severity` | `WiTagSeverity \| 'warning'` | — | 语义色。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `remove` | `MouseEvent` | 点击移除按钮时触发。 |
