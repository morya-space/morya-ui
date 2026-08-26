---
title: InputOtp
category: 02 / FORM
description: 多格单字符输入，适用于验证码。
---

# InputOtp

将字符串拆成多个单字符输入框。

## 引入

```ts
import { WiInputOtp } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputOtp } from '@well-insight/ui'

const code = ref('')
</script>

<template>
  <WiInputOtp v-model="code" :length="4" integer-only />
</template>
```

## Mask & size

`mask` 将格子设为密码输入。`size` / `gap` 控制尺寸与间距。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputOtp } from '@well-insight/ui'

const code = ref('')
</script>

<template>
  <WiInputOtp v-model="code" :length="4" mask size="large" :gap="8" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 拼接后的值。 |
| `length` | `number` | `4` | 位数。 |
| `integerOnly` | `boolean` | `false` | 仅数字。 |
| `mask` | `boolean` | `false` | 密码掩码。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `gap` | `string \| number` | — | 格子间距；数字为 px。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
