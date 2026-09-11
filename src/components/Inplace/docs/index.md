---
title: Inplace
category: 03 / DATA
description: 点击展示区切换为可编辑内容。
---

# Inplace

在 display 与 content 两种视图间切换。

## 引入

```ts
import { MInplace } from 'morya-ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { MButton, MInplace, MInput } from 'morya-ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('点击编辑')
</script>

<template>
  <MInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <MInput v-model="text" />
        <MButton label="完成" size="small" @click="close" />
      </div>
    </template>
  </MInplace>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否处于编辑态。 |
| `disabled` | `boolean` | `false` | 禁用切换。 |
| `closeOnEsc` | `boolean` | — | — |
| `dismissable` | `boolean` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽 | 说明 |
| --- | --- |
| `display` | 默认展示。 |
| `content` | 激活内容，提供 `{ close }`。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 激活态变化。 |
| `close` | — | — |
| `open` | — | — |
