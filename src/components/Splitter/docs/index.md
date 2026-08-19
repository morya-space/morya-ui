---
title: Splitter
category: 05 / PANEL
description: 双栏分割布局，支持水平 / 垂直与拖拽调整比例。
---

# Splitter

将内容拆成两个可并排或上下排列的区域，拖动分隔条即可调整比例。

## 引入

```ts
import { WdSplitter } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdSplitter } from '@well-insight/ui'
</script>

<template>
  <WdSplitter style="min-height: 8rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">Panel A — 拖中间分隔条</div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">Panel B</div>
    </template>
  </WdSplitter>
</template>
```

## Vertical

```vue preview
<script setup lang="ts">
import { WdSplitter } from '@well-insight/ui'
</script>

<template>
  <WdSplitter layout="vertical" style="min-height: 10rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden">
    <template #panel1>
      <div style="padding: 0.75rem">Top</div>
    </template>
    <template #panel2>
      <div style="padding: 0.75rem">Bottom</div>
    </template>
  </WdSplitter>
</template>
```

## Controlled size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSplitter } from '@well-insight/ui'

const size = ref(35)
</script>

<template>
  <div style="display:grid;gap:0.5rem">
    <p style="margin:0;color:var(--wd-color-text-muted);font-size:0.75rem">左侧 {{ size }}%</p>
    <WdSplitter
      v-model:size="size"
      style="min-height: 8rem; border: 1px solid var(--wd-color-border); border-radius: var(--wd-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding: 0.75rem">{{ size }}%</div>
      </template>
      <template #panel2>
        <div style="padding: 0.75rem">{{ 100 - size }}%</div>
      </template>
    </WdSplitter>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 分割方向。 |
| `size` | `number` | `50` | 主面板（左/上）占比，单位 `%`；支持 `v-model:size`。 |
| `min` / `max` | `number` | `10` / `90` | 主面板占比上下限。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `panel1` | 左侧 / 上方面板。 |
| `panel2` | 右侧 / 下方面板。 |
| `default` | 未使用命名插槽时取前两个子节点。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:size` | `number` | 拖拽或键盘调整后。 |
| `resize` | `number` | 同 `update:size`，便于监听。 |
