---
title: Switch
category: 02 / FORM
description: 开关。
---

# Switch

开关控件。

## 引入

```ts
import { WiSwitch } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiSwitch } from '@well-insight/ui'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <WiSwitch v-model="enabled" label="Enable notifications" />
</template>
```

## Invalid & inputId

`inputId` 是 `id` 的别名。

```vue preview
<script setup lang="ts">
import { WiSwitch } from '@well-insight/ui'
import { ref } from 'vue'

const dark = ref(false)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WiSwitch v-model="dark" input-id="dark-mode" label="Dark mode" />
    <WiSwitch :model-value="false" invalid label="Must be enabled" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiSwitch } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WiSwitch :model-value="true" disabled label="On disabled" />
    <WiSwitch :model-value="false" disabled label="Off disabled" />
  </div>
</template>
```

## Loading & text

```vue preview
<script setup lang="ts">
import { WiSwitch } from '@well-insight/ui'
import { ref } from 'vue'

const on = ref(true)
</script>

<template>
  <WiSwitch v-model="on" checked-text="开" unchecked-text="关" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 开关状态。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `inputId` | `string` | — | `id` 的别名。 |
| `name` | `string` | — | 原生 name。 |
| `value` | `string` | — | 原生 value。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `loading` | `boolean` | `false` | 加载中，阻止切换。 |
| `checkedText` | `string` | — | 开启时轨道文案。 |
| `uncheckedText` | `string` | — | 关闭时轨道文案。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 原生 required。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 状态变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义标签，优先于 `label`。 |
