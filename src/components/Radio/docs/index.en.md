---
title: Radio
category: 02 / FORM
description: Radio button. Supports invalid.
---

# Radio

Radio button.

## Import

```ts
import { WdRadio } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdRadio } from '@wex-design/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio v-model="size" name="size" value="sm" label="Small" />
    <WdRadio v-model="size" name="size" value="md" label="Medium" />
    <WdRadio v-model="size" name="size" value="lg" label="Large" />
  </div>
</template>
```

## Invalid

```vue preview
<script setup lang="ts">
import { WdRadio } from '@wex-design/ui'
import { ref } from 'vue'

const plan = ref('')
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio v-model="plan" name="plan" value="free" invalid label="Free" />
    <WdRadio v-model="plan" name="plan" value="pro" invalid label="Pro" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdRadio } from '@wex-design/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem">
    <WdRadio model-value="a" value="a" disabled label="Selected" />
    <WdRadio model-value="a" value="b" disabled label="Other" />
  </div>
</template>
```

## Group

```vue preview
<script setup lang="ts">
import { WdRadio, WdRadioGroup } from '@wex-design/ui'
import { ref } from 'vue'

const size = ref('md')
</script>

<template>
  <WdRadioGroup v-model="size">
    <WdRadio value="sm" label="Small" />
    <WdRadio value="md" label="Medium" />
    <WdRadio value="lg" label="Large" />
  </WdRadioGroup>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | Currently selected value. |
| `value` | `string \| number \| boolean` | — | **Required.** Value of this option. |
| `label` | `string` | — | Label text. You can also use the default slot. |
| `id` | `string` | — | Native id. |
| `name` | `string` | — | Native name. Must match within a group. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `invalid` | `boolean` | `false` | Invalid state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | Emitted when the selected value changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label. Takes precedence over `label`. |
