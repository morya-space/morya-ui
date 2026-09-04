---
title: Chip
category: 01 / BASIC
description: 芯片用于展示标签化信息，可带图标、图片与移除操作。
---

# Chip

芯片用于展示简短标签信息，可选图标/图片与移除按钮。

## 引入

```ts
import { WdChip } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdChip } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdChip label="Basic" />
    <WdChip label="With Icon" icon="check" />
    <WdChip label="Removable" removable />
    <WdChip label="Success" severity="success" size="small" />
    <WdChip label="Disabled" removable disabled />
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
| `severity` | `WdTagSeverity \| 'warning'` | — | 语义色。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `remove` | `MouseEvent` | 点击移除按钮时触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容。 |
| `icon` | 前置图标。 |
