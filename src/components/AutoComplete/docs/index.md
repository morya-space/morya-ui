---
title: AutoComplete
category: 02 / FORM
description: 输入时给出建议列表，可本地过滤或由父级提供。
---

# AutoComplete

输入建议补全；`complete` 事件便于父级异步加载。

## 引入

```ts
import { WiAutoComplete } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiAutoComplete } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest', 'Vue Router']
</script>

<template>
  <WiAutoComplete v-model="value" :suggestions="suggestions" dropdown placeholder="搜索…" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiAutoComplete } from '@well-insight/ui'
import { ref } from 'vue'

const a = ref('')
const b = ref('')
const c = ref('')
const suggestions = ['Vue', 'Vite', 'Vitest']
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiAutoComplete v-model="a" size="small" :suggestions="suggestions" placeholder="Small" />
    <WiAutoComplete v-model="b" :suggestions="suggestions" placeholder="Default" />
    <WiAutoComplete v-model="c" size="large" :suggestions="suggestions" placeholder="Large" />
  </div>
</template>
```

## Options & loading

`suggestions` 可传字符串或 `{ label, value }`。`loading` / `clearable` 控制加载与清空。

```vue preview
<script setup lang="ts">
import { WiAutoComplete } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
const suggestions = [
  { label: 'Vue', value: 'vue' },
  { label: 'Vite', value: 'vite' },
]
</script>

<template>
  <WiAutoComplete v-model="value" :suggestions="suggestions" clearable placeholder="选项对象…" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 输入值。 |
| `suggestions` | `(string \| { label: string; value: string })[]` | `[]` | 建议列表。 |
| `loading` | `boolean` | `false` | 加载中。 |
| `clearable` | `boolean` | `false` | 显示清空按钮。 |
| `dropdown` | `boolean` | `false` | 显示下拉按钮。 |
| `placeholder` | `string` | — | 占位。 |
| `size` | `WiSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `complete` | `query: string` | 请求补全。 |
