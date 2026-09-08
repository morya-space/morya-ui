---
title: Checkbox
category: 02 / FORM
description: Checkbox. Boolean modelValue; supports invalid.
---

# Checkbox

Binary checkbox.

## Import

```ts
import { RdCheckbox } from '@wise-kit/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { RdCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <RdCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { RdCheckbox } from '@wise-kit/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <RdCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { RdCheckbox } from '@wise-kit/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <RdCheckbox :model-value="true" disabled label="Checked disabled" />
    <RdCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Group

`RdCheckboxGroup` uses an array `v-model`. Children identify themselves with `value`. `indeterminate` is a mixed visual.

```vue preview
<script setup lang="ts">
import { RdCheckbox, RdCheckboxGroup } from '@wise-kit/ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <RdCheckboxGroup v-model="selected">
    <RdCheckbox value="vue" label="Vue" />
    <RdCheckbox value="react" label="React" />
    <RdCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </RdCheckboxGroup>
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
