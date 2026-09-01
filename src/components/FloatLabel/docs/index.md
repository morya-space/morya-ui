---
title: FloatLabel
category: 02 / FORM
description: 浮动标签容器，聚焦或有值时上浮。
---

# FloatLabel

包裹输入控件，标签在聚焦或有内容时上浮。子输入建议设置非空 `placeholder`（如空格）以配合 `:placeholder-shown`。

## 引入

```ts
import { WiFloatLabel, WiInput } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiFloatLabel, WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WiFloatLabel label="Username">
    <WiInput v-model="value" placeholder=" " />
  </WiFloatLabel>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 标签文案；也可用 `label` 插槽。 |

## Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 输入控件。 |
| `label` | 自定义标签内容。 |

## 无障碍

- 挂载后会将 `<label for>` 关联到容器内第一个 `input` / `textarea` / `select`。
- 子控件应设置 `id`，或使用库内会自动生成 id 的输入组件。
- 配合 `placeholder=" "` 时，请确保屏幕阅读器仍能获知字段用途（标签文案或 `aria-label`）。

## Events

无自定义事件。
