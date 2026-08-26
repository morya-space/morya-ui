---
title: DatePicker
category: 02 / FORM
description: 日历弹层选择日期。单日或日期范围，值优先为 ISO 日期字符串。支持 min/max、shortcuts、format、clearable。
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

## Range

`type="daterange"` 时先点起点、再点终点；值为 `[start, end]`（ISO 日期）。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref<[string, string] | null>(['2024-06-01', '2024-06-12'])
</script>

<template>
  <WiDatePicker v-model="value" type="daterange" label="日期范围" />
</template>
```

## Shortcuts

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiDatePicker } from '@well-insight/ui'

const value = ref<string | null>(null)
const shortcuts = [
  { label: '今天', value: () => new Date() },
  { label: '六月一日', value: '2024-06-01' },
]
</script>

<template>
  <WiDatePicker v-model="value" label="快捷选项" :shortcuts="shortcuts" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| [string, string] \| null` | `null` | 单日输出 `YYYY-MM-DD`；范围输出 `[start, end]`。 |
| `type` | `'date' \| 'daterange'` | `'date'` | 单日或范围。 |
| `label` | `string` | — | 标签。 |
| `minDate` | `string \| Date \| null` | — | 可选下限。 |
| `maxDate` | `string \| Date \| null` | — | 可选上限。 |
| `placeholder` | `string` | locale | 占位。 |
| `format` | `string` | `'YYYY-MM-DD'` | 输入框展示格式；提交值仍为 ISO。 |
| `clearable` | `boolean` | `true` | 显示清除按钮。 |
| `shortcuts` | `DatePickerShortcut[]` | `[]` | 面板快捷选项。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `size` | `WiSizeInput` | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `teleport` | `boolean` | `true` | 面板 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| [string, string] \| null` | 值变化。 |
