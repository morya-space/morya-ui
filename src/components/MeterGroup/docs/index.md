---
title: MeterGroup
category: 07 / MISC
description: 多段占比计量条。
---

# MeterGroup

展示多段 `{ label, value, color }` 占比。

## 引入

```ts
import { WiMeterGroup } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiMeterGroup } from '@well-insight/ui'

const value = [
  { label: '应用', value: 45, color: '#2563eb' },
  { label: '媒体', value: 25, color: '#16a34a' },
  { label: '其他', value: 15, color: '#ea580c' },
]
</script>

<template>
  <WiMeterGroup :value="value" :max="100" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `MeterGroupItem[]` | — | 分段数据。 |
| `max` | `number` | 分段之和 | 总量上限。 |
