---
title: InputTags
category: 02 / FORM
description: 芯片式标签输入，回车添加、可移除。
---

# InputTags

以芯片列表管理字符串标签。

## 引入

```ts
import { WiInputTags } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputTags } from '@well-insight/ui'

const tags = ref(['vue', 'design'])
</script>

<template>
  <WiInputTags v-model="tags" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `[]` | 标签列表。 |
| `placeholder` | `string` | `'输入后回车添加'` | 空列表时占位。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `addOnBlur` | `boolean` | `false` | 失焦时也添加。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string[]` | 标签变化。 |
