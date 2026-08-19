---
title: Toolbar
category: 05 / PANEL
description: 工具栏布局，分 start / center / end 区域。
---

# Toolbar

水平排列操作区，常用于列表页顶栏。

## 引入

```ts
import { WdToolbar, WdButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdToolbar, WdButton } from '@well-insight/ui'
</script>

<template>
  <WdToolbar>
    <template #start>
      <WdButton label="新建" size="small" />
    </template>
    <template #center>
      <span>工具栏</span>
    </template>
    <template #end>
      <WdButton label="导出" severity="secondary" size="small" />
    </template>
  </WdToolbar>
</template>
```

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `start` | 左侧区域。 |
| `center` | 中间区域。 |
| `end` | 右侧区域。 |
