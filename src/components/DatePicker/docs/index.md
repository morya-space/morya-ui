---
title: DatePicker
category: 02 / FORM
description: 日历弹层选择日期，值优先为 ISO 日期字符串。支持 min/max、invalid、disabled、fluid；面板支持 teleport / appendTo。
---

# DatePicker

带月份导航与日网格的日期选择器。

## 引入

```ts
import { WiDatePicker } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker v-model="value" label="日期" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const a = ref('2024-06-15')
const b = ref('2024-06-15')
const c = ref('2024-06-15')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-end">
    <WiDatePicker v-model="a" size="small" label="Small" />
    <WiDatePicker v-model="b" label="Default" />
    <WiDatePicker v-model="c" size="large" label="Large" />
  </div>
</template>
```

## Min / Max

超出范围的日期在日历中禁用。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker
    v-model="value"
    label="范围内"
    min-date="2024-06-01"
    max-date="2024-06-30"
  />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker v-model="value" label="校验失败" invalid />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
</script>

<template>
  <WiDatePicker model-value="2024-06-15" label="禁用" disabled />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref<string | null>(null)
</script>

<template>
  <WiDatePicker v-model="value" label="全宽" fluid placeholder="选择日期" />
</template>
```

## Teleport

面板默认 Teleport 到 `body`。可用 `append-to="self"` 或 `teleport={false}` 就地渲染。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref<string | null>(null)
</script>

<template>
  <WiDatePicker v-model="value" label="就地面板" append-to="self" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| null` | `null` | 绑定值，输出为 `YYYY-MM-DD`。 |
| `label` | `string` | — | 标签。 |
| `minDate` | `string \| Date \| null` | — | 可选下限。 |
| `maxDate` | `string \| Date \| null` | — | 可选上限。 |
| `placeholder` | `string` | `选择日期` | 占位。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `size` | `WiSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `teleport` | `boolean` | `true` | 面板 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | 值变化。 |
