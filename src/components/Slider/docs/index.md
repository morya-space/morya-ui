---
title: Slider
category: 02 / FORM
description: 滑动条，支持单值与区间选择。
---

# Slider

拖动选择数值。`range` 模式下使用两个滑块，绑定值为 `[min, max]`。

## 引入

```ts
import { WiSlider } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiSlider } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WiSlider v-model="value" />
    <p style="margin:.5rem 0 0;color:var(--wi-color-text-muted)">
      {{ value }}
    </p>
  </div>
</template>
```

## Range

```vue preview
<script setup lang="ts">
import { WiSlider } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref([20, 70])
</script>

<template>
  <div style="width:min(24rem,100%)">
    <WiSlider v-model="value" range />
    <p style="margin:.5rem 0 0;color:var(--wi-color-text-muted)">
      {{ value.join(' – ') }}
    </p>
  </div>
</template>
```

## Marks & vertical

`marks` 可以是数值数组，或「值 → 文案」映射。`tooltip` 在拖动时显示当前值。

```vue preview
<script setup lang="ts">
import { WiSlider } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref(50)
</script>

<template>
  <div style="display:flex;gap:2rem;align-items:stretch;height:10rem">
    <div style="flex:1">
      <WiSlider v-model="value" tooltip :marks="{ 0: '0', 50: '半', 100: '满' }" />
    </div>
    <WiSlider v-model="value" vertical tooltip />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[]` | `0` | 绑定值；区间模式为二元数组。 |
| `min` | `number` | `0` | 最小值。 |
| `max` | `number` | `100` | 最大值。 |
| `step` | `number` | `1` | 步进。 |
| `range` | `boolean` | `false` | 区间模式。 |
| `marks` | `number[] \| Record<number, string>` | — | 刻度；数组为值，对象为文案。 |
| `tooltip` | `boolean` | `false` | 拖动时显示当前值。 |
| `vertical` | `boolean` | `false` | 垂直方向。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `ariaLabel` | `string` | — | — |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `label` | `string` | — | — |
| `size` | `WiSizeInput` | — | — |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | 值变化。 |

## Slots

无插槽。
