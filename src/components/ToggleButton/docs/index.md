---
title: ToggleButton
category: 02 / FORM
description: 在开/关两种标签状态间切换的按钮。
---

# ToggleButton

布尔切换按钮，可配置开/关文案与图标。

## 引入

```ts
import { WdToggleButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdToggleButton } from '@well-insight/ui'

const on = ref(false)
</script>

<template>
  <WdToggleButton v-model="on" on-label="开启" off-label="关闭" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdToggleButton } from '@well-insight/ui'

const a = ref(false)
const b = ref(true)
const c = ref(false)
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
    <WdToggleButton v-model="a" size="small" on-label="小" off-label="小" />
    <WdToggleButton v-model="b" on-label="默认" off-label="默认" />
    <WdToggleButton v-model="c" size="large" on-label="大" off-label="大" />
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 是否开启。 |
| `onLabel` / `offLabel` | `string` | `On` / `Off` | 文案。 |
| `onIcon` / `offIcon` | `string` | — | 可选图标字符。 |
| `size` | `WdSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 值变化。 |
