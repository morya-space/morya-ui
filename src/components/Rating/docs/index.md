---
title: Rating
category: 02 / FORM
description: 星级评分控件，支持清除与只读。
---

# Rating

点击星星进行评分。默认提供清除按钮。

## 引入

```ts
import { WiRating } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiRating } from '@well-insight/ui'

const value = ref(3)
</script>

<template>
  <WiRating v-model="value" />
</template>
```

## Readonly

```vue preview
<script setup lang="ts">
import { WiRating } from '@well-insight/ui'
</script>

<template>
  <WiRating :model-value="4" readonly :cancel="false" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | 当前评分。 |
| `stars` | `number` | `5` | 星星数量。 |
| `cancel` | `boolean` | `true` | 显示清除按钮。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number` | 评分变化。 |
