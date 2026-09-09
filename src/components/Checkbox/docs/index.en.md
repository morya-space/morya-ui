---
title: Checkbox
category: 02 / FORM
description: Checkbox. Boolean modelValue; supports invalid.
---

# Checkbox

Binary checkbox.

## Import

```ts
import { MCheckbox } from 'morya-ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <MCheckbox v-model="accepted" label="Accept terms and conditions" />
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <MCheckbox v-model="accepted" invalid label="You must accept to continue" />
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { MCheckbox } from 'morya-ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <MCheckbox :model-value="true" disabled label="Checked disabled" />
    <MCheckbox :model-value="false" disabled label="Unchecked disabled" />
  </div>
</template>
```

## Group

`MCheckboxGroup` uses an array `v-model`. Children identify themselves with `value`. `indeterminate` is a mixed visual.

```vue preview
<script setup lang="ts">
import { MCheckbox, MCheckboxGroup } from 'morya-ui'
import { ref } from 'vue'

const selected = ref(['vue'])
</script>

<template>
  <MCheckboxGroup v-model="selected">
    <MCheckbox value="vue" label="Vue" />
    <MCheckbox value="react" label="React" />
    <MCheckbox :indeterminate="selected.length === 1" label="Mixed (demo)" />
  </MCheckboxGroup>
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
