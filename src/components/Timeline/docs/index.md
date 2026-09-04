---
title: Timeline
category: 03 / DATA
description: 垂直 / 水平时间轴，支持图标 marker 与自定义插槽。
---

# Timeline

按时间顺序展示事件节点。

## 引入

```ts
import { WdTimeline } from '@wex-design/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Ordered', date: '15/10/2024', content: 'Order placed', icon: 'check', severity: 'success' },
  { status: 'Shipped', date: '16/10/2024', content: 'On the way', icon: 'upload', severity: 'info' },
  { status: 'Delivered', date: '17/10/2024', content: 'Arrived', icon: 'home', severity: 'success' },
]
</script>

<template>
  <WdTimeline :value="events" align="alternate" />
</template>
```

## Horizontal

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Start', date: '周一', content: 'Kickoff', icon: 'check' },
  { status: 'Build', date: '周三', content: 'Implementation', icon: 'settings' },
  { status: 'Ship', date: '周五', content: 'Release', icon: 'check-circle' },
]
</script>

<template>
  <WdTimeline :value="events" layout="horizontal" />
</template>
```

## Pending & item slot

`pending` 为 `true` 或文案时追加末尾待处理节点。`#item` 可整项自定义。

```vue preview
<script setup lang="ts">
import { WdTimeline } from '@wex-design/ui'

const events = [
  { status: 'Done', date: '周一', content: 'Shipped' },
]
</script>

<template>
  <WdTimeline :value="events" pending="Waiting">
    <template #item="{ item }">
      <span>{{ item.content || item.status }}</span>
    </template>
  </WdTimeline>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `TimelineEvent[]` | — | 事件。 |
| `align` | `'left' \| 'right' \| 'alternate'` | `'left'` | 垂直布局对齐。 |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | 方向。 |
| `pending` | `boolean \| string` | — | 追加末尾待处理项；字符串作为文案。 |

`TimelineEvent`：`status` / `content` / `date` / `icon`（`IconName` 或文字）/ `color` / `severity`。

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | 整项自定义，`{ item, index }`；不传时使用 opposite / marker / content。 |
| `content` | 主内容，`{ item, index }`。 |
| `opposite` | 对侧内容，默认显示 `date`。 |
| `marker` | 自定义节点圆点。 |
| `connector` | 自定义连接线。 |

## Events

无自定义事件。
