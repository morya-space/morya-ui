---
title: Select
category: 02 / FORM
description: 表单选择器，支持 invalid、size、fluid、showClear、filter、emptyMessage；选项禁用；与动作菜单 Dropdown 不同。
---

# Select

表单选择器，用于从选项列表中选择单个值。

**与 Dropdown 的区别：** `WiSelect` 是表单控件；动作菜单请使用 `WiDropdown`。

## 引入

```ts
import { WiSelect } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | number | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
  { label: 'Unavailable', value: 'na', disabled: true },
]
</script>

<template>
  <WiSelect v-model="value" label="Team" :options="options" placeholder="Choose a team" />
</template>
```

## Clearable

`showClear` 在已选值时显示清除按钮。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | number | undefined>('design')
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect v-model="value" label="Team" :options="options" show-clear />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect
    v-model="value"
    :options="options"
    placeholder="Required"
    invalid
    help-text="Please select a team"
  />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiSelect } from '@well-insight/ui'

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect model-value="design" :options="options" disabled />
</template>
```

## Sizes

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Small', value: 'sm' },
  { label: 'Large', value: 'lg' },
]
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-start">
    <WiSelect v-model="value" :options="options" size="small" placeholder="Small" />
    <WiSelect v-model="value" :options="options" placeholder="Normal" />
    <WiSelect v-model="value" :options="options" size="large" placeholder="Large" />
  </div>
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
]
</script>

<template>
  <WiSelect v-model="value" :options="options" fluid placeholder="Fluid width" />
</template>
```

## Empty

无选项或筛选无结果时展示空态文案；可用 `emptyMessage` 覆盖，否则读取 ConfigProvider `locale.emptyMessage`。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const cities = [
  { label: 'Shanghai', value: 'sh' },
  { label: 'Beijing', value: 'bj' },
  { label: 'Shenzhen', value: 'sz' },
]
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <WiSelect v-model="value" :options="[]" empty-message="暂无选项" placeholder="Empty list" />
    <WiSelect v-model="value" :options="cities" filter placeholder="Filter cities" />
  </div>
</template>
```

## Teleport

菜单默认 Teleport 到 `body`（`teleport` + `appendTo`）。设 `append-to="self"` 或 `teleport={false}` 可就地渲染。

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiSelect } from '@well-insight/ui'

const value = ref<string | undefined>()
const options = [
  { label: 'In place', value: 'local' },
  { label: 'Teleported', value: 'body' },
]
</script>

<template>
  <WiSelect v-model="value" :options="options" append-to="self" placeholder="Append to self" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 选中值。 |
| `options` | `SelectOption[]` | — | 选项列表。 |
| `label` | `string` | — | 字段标签。 |
| `helpText` | `string` | — | 辅助说明。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `error` | `boolean` | `false` | **已弃用**，请使用 `invalid`。 |
| `placeholder` | `string` | — | 占位文案。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 表单必填辅助。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `fluid` | `boolean` | `false` | 宽度撑满容器。 |
| `showClear` | `boolean` | `false` | 有值时显示清除按钮。 |
| `emptyMessage` | `string` | — | 空选项文案；默认取 `locale.emptyMessage`，再回退 `暂无选项`。 |
| `filter` | `boolean` | `false` | 打开菜单时显示筛选输入（按 label includes）。 |
| `teleport` | `boolean` | `true` | 菜单 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | 挂载目标；`'self'` 就地渲染。 |
| `placement` | `'bottom-start' \| 'bottom-end'` | `'bottom-start'` | 菜单对齐。 |
| `id` | `string` | — | 控件 id。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `SelectValue \| undefined` | 值变化。 |
| `change` | `SelectValue \| undefined` | 选择完成或清除。 |
| `clear` | — | 点击清除时触发。 |
| `show` | — | 菜单打开。 |
| `hide` | — | 菜单关闭。 |
