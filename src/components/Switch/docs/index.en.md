---
title: Switch
category: 02 / FORM
description: Toggle switch.
---

# Switch

Toggle switch control.

## Import

```ts
import { WdSwitch } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSwitch } from '@well-insight/ui'

const enabled = ref(false)
</script>

<template>
  <WdSwitch v-model="enabled" label="Enable notifications" />
</template>
```

## Invalid & inputId

`inputId` is an alias for `id`.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSwitch } from '@well-insight/ui'

const dark = ref(false)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WdSwitch v-model="dark" input-id="dark-mode" label="Dark mode" />
    <WdSwitch :model-value="false" invalid label="Must be enabled" />
  </div>
</template>
```

## Disabled

```vue preview
<script setup lang="ts">
import { WdSwitch } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.75rem">
    <WdSwitch :model-value="true" disabled label="On disabled" />
    <WdSwitch :model-value="false" disabled label="Off disabled" />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | On/off state. |
| `label` | `string` | — | Label text; the default slot can be used instead. |
| `id` | `string` | — | Native id. |
| `inputId` | `string` | — | Alias for `id`. |
| `name` | `string` | — | Native name. |
| `value` | `string` | — | Native value. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `required` | `boolean` | `false` | Native required. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the state changes. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom label; takes precedence over `label`. |
