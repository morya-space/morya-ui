---
title: DatePicker
category: 02 / FORM
description: Calendar overlay for picking a date. Values are ISO date strings by preference. Supports min/max, invalid, disabled, and fluid; the panel supports teleport / appendTo.
---

# DatePicker

Date picker with month navigation and a day grid.

## Import

```ts
import { WdDatePicker } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WdDatePicker v-model="value" label="Date" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const a = ref('2024-06-15')
const b = ref('2024-06-15')
const c = ref('2024-06-15')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:flex-end">
    <WdDatePicker v-model="a" size="small" label="Small" />
    <WdDatePicker v-model="b" label="Default" />
    <WdDatePicker v-model="c" size="large" label="Large" />
  </div>
</template>
```

## Min / Max

Dates outside the range are disabled in the calendar.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WdDatePicker
    v-model="value"
    label="In range"
    min-date="2024-06-01"
    max-date="2024-06-30"
  />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const value = ref('2024-06-15')
</script>

<template>
  <WdDatePicker v-model="value" label="Invalid" invalid />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdDatePicker } from '@well-insight/ui'
</script>

<template>
  <WdDatePicker model-value="2024-06-15" label="Disabled" disabled />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const value = ref<string | null>(null)
</script>

<template>
  <WdDatePicker v-model="value" label="Full width" fluid placeholder="Select date" />
</template>
```

## Teleport

The panel Teleports to `body` by default. Use `append-to="self"` or `teleport={false}` to render in place.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdDatePicker } from '@well-insight/ui'

const value = ref<string | null>(null)
</script>

<template>
  <WdDatePicker v-model="value" label="In-place panel" append-to="self" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| null` | `null` | Bound value, output as `YYYY-MM-DD`. |
| `label` | `string` | — | Label. |
| `minDate` | `string \| Date \| null` | — | Optional lower bound. |
| `maxDate` | `string \| Date \| null` | — | Optional upper bound. |
| `placeholder` | `string` | `Select date` | Placeholder. |
| `fluid` | `boolean` | `false` | Stretch to full width. |
| `size` | `WdSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `teleport` | `boolean` | `true` | Panel Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| null` | Value change. |
