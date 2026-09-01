---
title: InputNumber
category: 02 / FORM
description: 数字输入框，支持步进按钮、上下限与尺寸。
---

# InputNumber

数字输入。可显示增减按钮，并按 `min` / `max` / `step` 约束取值。

## 引入

```ts
import { WiInputNumber } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(1)
</script>

<template>
  <WiInputNumber v-model="value" label="Quantity" :min="0" :max="99" />
</template>
```

## Buttons

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <WiInputNumber v-model="value" label="With buttons" show-buttons :min="0" :max="20" :step="1" />
</template>
```

## Precision & placement

`precision` 控制小数位。`button-placement="right"` 把增减按钮放到右侧。`clearable` 可清空。

```vue preview
<script setup lang="ts">
import { WiInputNumber } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(1.25)
</script>

<template>
  <WiInputNumber v-model="value" show-buttons button-placement="right" :precision="2" :step="0.25" clearable />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `min` | `number` | — | 最小值。 |
| `max` | `number` | — | 最大值。 |
| `step` | `number` | `1` | 步进。 |
| `precision` | `number` | — | 小数位数。 |
| `showButtons` | `boolean` | `false` | 显示增减按钮。 |
| `buttonPlacement` | `'both' \| 'right'` | `'both'` | 按钮位置。 |
| `clearable` | `boolean` | `false` | 显示清空。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | 值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 前缀。 |
| `suffix` | 后缀。 |
