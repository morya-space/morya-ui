---
title: MeterGroup
category: 07 / MISC
description: Segmented meter for proportional values.
---

# MeterGroup

Displays multiple `{ label, value, color }` segments as a proportion of the total.

## Import

```ts
import { WdMeterGroup } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdMeterGroup } from '@well-insight/ui'

const value = [
  { label: 'Apps', value: 45, color: '#2563eb' },
  { label: 'Media', value: 25, color: '#16a34a' },
  { label: 'Other', value: 15, color: '#ea580c' },
]
</script>

<template>
  <WdMeterGroup :value="value" :max="100" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `MeterGroupItem[]` | — | Segment data. |
| `max` | `number` | Sum of segments | Maximum total. |
