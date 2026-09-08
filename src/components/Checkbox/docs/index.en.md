---
title: Checkbox
category: 02 / FORM
description: Checkbox. Boolean modelValue; supports invalid.
---

# Checkbox

Binary checkbox.

## Import

```ts
import { WkCheckbox } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WkCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <WkCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WkCheckbox } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WkCheckbox :model-value="true" disabled label="Checked disabled" />
    <WkCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Group

`WkCheckboxGroup` uses an array `v-model`. Children identify themselves with `value`. `indeterminate` is a mixed visual.

```vue preview
<script setup lang="ts">
import { WkCheckbox, WkCheckboxGroup } from '@wise-kit/ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <WkCheckboxGroup v-model="selected">
    <WkCheckbox value="vue" label="Vue" />
    <WkCheckbox value="react" label="React" />
    <WkCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </WkCheckboxGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Binary checked state. |
| `label` | `string` | — | Label text; default slot also works. |
| `id` | `string` | — | Native id. |
| `name` | `string` | — | Native name. |
| `value` | `string \| number \| boolean` | — | Option value inside a group. |
| `indeterminate` | `boolean` | `false` | Mixed state. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid validation state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Checked state change. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label; takes precedence over `label`. |
