---
title: MeterGroup
category: 03 / DATA
description: 多段占比计量条。
---

# MeterGroup

展示多段 `{ label, value, color }` 占比。

## 引入

```ts
import { MMeterGroup } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MMeterGroup } from 'morya-ui'

const value = [
  { label: '应用', value: 45, color: '#2563eb' },
  { label: '媒体', value: 25, color: '#16a34a' },
  { label: '其他', value: 15, color: '#ea580c' },
]
</script>

<template>
  <MMeterGroup :value="value" :max="100" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `MeterGroupItem[]` | — | 分段数据。 |
| `max` | `number` | 分段之和 | 总量上限。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `label` | 自定义标签 `{ meter }`。 |

## 类型

<h4 id="MeterGroupItem">MeterGroupItem</h4>

完整定义见源码 `types.ts`。

```ts
interface MeterGroupItem {
  label: string
  value: number
  color?: string
}
```
