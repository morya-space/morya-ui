---
title: InputColor
category: 02 / FORM
description: 颜色选择，支持色板与十六进制文本。
---

# InputColor

通过原生色板与文本框编辑 hex 颜色。

## 引入

```ts
import { WiInputColor } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputColor } from '@well-insight/ui'

const color = ref('#2563eb')
</script>

<template>
  <WiInputColor v-model="color" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `'#000000'` | 十六进制颜色。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `id` | `string` | — | 色板 input id。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 颜色变化。 |
