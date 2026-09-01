---
title: Input
category: 02 / FORM
description: 文本输入框。
---

# Input

单行文本输入。

## 引入

```ts
import { WiInput } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WiInput v-model="value" label="Name" placeholder="Enter your name" />
</template>
```

## Invalid

`invalid` 表示校验失败；也可只传 `error-message`。

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <WiInput invalid label="Email" model-value="not-an-email" help-text="Enter a valid email" />
</template>
```

## Clearable

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <WiInput v-model="value" clearable label="Note" />
</template>
```

## Prefix / Suffix

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiInput v-model="amount" label="金额" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </WiInput>
    <WiInput v-model="host" label="域名" fluid>
      <template #suffix>
        .well.design
      </template>
    </WiInput>
  </div>
</template>
```

## Password-like type

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <WiInput v-model="password" type="password" label="Password" placeholder="••••••••" />
</template>
```

## Sizes

支持 `small` / `large`，并兼容 `sm` / `md` / `lg`。

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiInput size="small" label="Small" placeholder="Small" />
    <WiInput label="Normal" placeholder="Normal" />
    <WiInput size="large" label="Large" placeholder="Large" />
  </div>
</template>
```

## Count

`showCount` 显示字数；配合 `maxlength` 展示上限。

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const bio = ref('Hello')
</script>

<template>
  <WiInput v-model="bio" label="Bio" :maxlength="20" show-count />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:100%">
    <WiInput variant="outlined" label="Outlined" placeholder="Outlined" />
    <WiInput variant="filled" label="Filled" placeholder="Filled" />
    <WiInput fluid label="Fluid" placeholder="Full width" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiInput } from '@well-insight/ui'
</script>

<template>
  <WiInput model-value="Read only value" label="Disabled" disabled />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `id` | `string` | — | 原生 id；未传时自动生成。 |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'url' \| 'tel'` | `'text'` | 原生 type。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸；默认中等。 |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 样式变体。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `clearable` | `boolean` | `false` | 显示清除按钮。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `showCount` | `boolean` | `false` | 显示字数统计。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 输入框左侧装饰（如单位、图标）。 |
| `suffix` | 输入框右侧装饰；与清除按钮可并存。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `clear` | — | 点击清除时触发。 |

## Instance

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦底层 input。 |
