---
title: InputPassword
category: 02 / FORM
description: 密码输入框，支持显示/隐藏与强度提示。
---

# InputPassword

密码输入。默认提供显示/隐藏切换；可选密码强度反馈。

## 引入

```ts
import { WdInputPassword } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInputPassword } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WdInputPassword v-model="value" label="Password" />
</template>
```

## Feedback

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdInputPassword } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WdInputPassword v-model="value" label="Password" feedback />
</template>
```

## Custom icons

默认用 `eye` / `eye-off`。可用属性换成其它系统图标，或用插槽完全自定义。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdIcon, WdInputPassword } from '@well-insight/ui'

const byProp = ref('')
const bySlot = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;max-width:20rem">
    <WdInputPassword v-model="byProp" label="属性替换" show-icon="unlock" hide-icon="lock" />
    <WdInputPassword v-model="bySlot" label="插槽替换">
      <template #showIcon>
        <WdIcon name="search" size="sm" />
      </template>
      <template #hideIcon>
        <WdIcon name="close" size="sm" />
      </template>
    </WdInputPassword>
  </div>
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `feedback` | `boolean` | `false` | 显示强度提示。 |
| `toggleMask` | `boolean` | `true` | 显示切换明文按钮。 |
| `showIcon` | `IconName \| Component` | `'eye'` | 密文态图标（点击显示）。 |
| `hideIcon` | `IconName \| Component` | `'eye-off'` | 明文态图标（点击隐藏）。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |

## Slots

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `showIcon` | `{ unmasked }` | 替换显示密码图标。 |
| `hideIcon` | `{ unmasked }` | 替换隐藏密码图标。 |
