---
title: Knob
category: 02 / FORM
description: SVG 圆形旋钮，用于选择数值。
---

# Knob

圆形刻度控件，支持拖动与键盘调节。

## 引入

```ts
import { WiKnob } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiKnob } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(60)
</script>

<template>
  <WiKnob v-model="value" :size="120" value-template="{value}%" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 当前值。 |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | 范围与步进。 |
| `size` | `number` | `100` | 直径像素。 |
| `valueTemplate` | `string` | `{value}` | 展示模板。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `ariaLabel` | `string` | — | — |
| `ariaLabelledby` | `string` | — | — |
| `diameter` | `number` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 值变化。 |

## Slots

无插槽。
