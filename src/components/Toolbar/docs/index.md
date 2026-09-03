---
title: Toolbar
category: 06 / LAYOUT
description: 工具栏布局，分 start / center / end 区域。
---

# Toolbar

水平排列操作区，常用于列表页顶栏。

## 引入

```ts
import { WiButton, WiToolbar } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiButton, WiToolbar } from '@well-insight/ui'
</script>

<template>
  <WiToolbar>
    <template #start>
      <WiButton label="新建" size="small" />
    </template>
    <template #center>
      <span>工具栏</span>
    </template>
    <template #end>
      <WiButton label="导出" severity="secondary" size="small" />
    </template>
  </WiToolbar>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | — |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `start` | 左侧区域。 |
| `center` | 中间区域。 |
| `end` | 右侧区域。 |

## Events

无自定义事件。
