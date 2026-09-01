---
title: CascadeSelect
category: 02 / FORM
description: 多级联级选择，支持嵌套 options 与分栏面板。
---

# CascadeSelect

从嵌套选项中逐级选择一个值。

## 引入

```ts
import { WiCascadeSelect } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiCascadeSelect } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref<string | number | null>(null)
const options = [
  {
    label: '电子产品',
    value: 'electronics',
    children: [
      { label: '手机', value: 'phone' },
      { label: '笔记本', value: 'laptop' },
    ],
  },
  { label: '图书', value: 'books' },
]
</script>

<template>
  <WiCascadeSelect v-model="value" :options="options" placeholder="选择分类" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiCascadeSelect } from '@well-insight/ui'
import { ref } from 'vue'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [
  { label: '图书', value: 'books' },
  { label: '影音', value: 'media' },
]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiCascadeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <WiCascadeSelect v-model="b" :options="options" placeholder="Default" />
    <WiCascadeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | `null` | 选中值。 |
| `options` | `CascadeSelectOption[]` | — | 嵌套选项。 |
| `label` | `string` | — | 字段标签。 |
| `helpText` | `string` | — | 帮助文案。 |
| `invalid` | `boolean` | `false` | 无效状态。 |
| `errorMessage` | `string` | — | 错误文案；设置时视为 invalid。 |
| `id` | `string` | — | 控件 id。 |
| `placeholder` | `string` | `'请选择'` | 占位文案。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 表单必填辅助。 |
| `size` | `WiSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `fluid` | `boolean` | `false` | 宽度撑满容器。 |
| `clearable` | `boolean` | `false` | 有值时显示清除按钮（hover 单槽 suffix）。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `CascadeSelectValue` | 选中变化。 |
| `clear` | — | 点击清除时触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `value` | 触发器展示内容。 |
| `option` | 选项 `{ option }`。 |
