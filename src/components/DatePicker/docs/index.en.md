---
title: DatePicker
category: 02 / FORM
description: Calendar overlay for a date or date range. Values are ISO date strings. Supports min/max, shortcuts, format, and clearable.
---

# DatePicker

Date picker with month navigation and a day grid.

## Import

```ts
import { WiDatePicker } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker v-model="value" label="Date" />
</template>
```

## Size

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

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

Dates outside the range are disabled in the calendar.

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker
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
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('2024-06-15')
</script>

<template>
  <WiDatePicker v-model="value" label="Invalid" invalid />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
</script>

<template>
  <WiDatePicker model-value="2024-06-15" label="Disabled" disabled />
</template>
```

## Fluid

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
</script>

<template>
  <WiDatePicker v-model="value" label="Full width" fluid placeholder="Select date" />
</template>
```

## Teleport

The panel Teleports to `body` by default. Use `append-to="self"` or `teleport={false}` to render in place.

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
</script>

<template>
  <WiDatePicker v-model="value" label="In-place panel" append-to="self" />
</template>
```

## Range

With `type="daterange"`, click the start date then the end date. The value is `[start, end]` (ISO dates).

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref<[string, string] | null>(['2024-06-01', '2024-06-12'])
</script>

<template>
  <WiDatePicker v-model="value" type="daterange" label="Date range" />
</template>
```

## Shortcuts

```vue preview
<script setup lang="ts">
import { WiDatePicker } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
const shortcuts = [
  { label: 'Today', value: () => new Date() },
  { label: 'June 1', value: '2024-06-01' },
]
</script>

<template>
  <WiDatePicker v-model="value" label="Shortcuts" :shortcuts="shortcuts" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| Date \| [string, string] \| null` | `null` | Single day emits `YYYY-MM-DD`; range emits `[start, end]`. |
| `type` | `'date' \| 'daterange'` | `'date'` | Single day or range. |
| `label` | `string` | — | Label. |
| `minDate` | `string \| Date \| null` | — | Optional lower bound. |
| `maxDate` | `string \| Date \| null` | — | Optional upper bound. |
| `placeholder` | `string` | locale | Placeholder. |
| `format` | `string` | `'YYYY-MM-DD'` | Input display pattern; the emitted value stays ISO. |
| `clearable` | `boolean` | `true` | Show a clear button. |
| `shortcuts` | `DatePickerShortcut[]` | `[]` | Panel shortcuts. |
| `fluid` | `boolean` | `false` | Stretch to full width. |
| `size` | `WiSizeInput` | — | `small` / `large`; can inherit from ConfigProvider. |
| `disabled` | `boolean` | `false` | Disabled. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `teleport` | `boolean` | `true` | Panel Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | Mount target; `'self'` / `false` renders in place. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| [string, string] \| null` | Value change. |

## Slots

| Slot | Description |
| --- | --- |
| `trigger` | Custom trigger `{ value, open }`. |
