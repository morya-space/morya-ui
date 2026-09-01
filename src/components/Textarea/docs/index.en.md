---
title: Textarea
category: 02 / FORM
description: Multi-line text input.
---

# Textarea

Multi-line text input.

## Import

```ts
import { WiTextarea } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiTextarea } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <WiTextarea v-model="value" label="Notes" placeholder="Write something…" />
</template>
```

## Size & Variant

```vue preview
<script setup lang="ts">
import { WiTextarea } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiTextarea size="small" label="Small" rows="3" />
    <WiTextarea variant="filled" label="Filled" rows="3" />
    <WiTextarea size="large" fluid label="Large Fluid" rows="3" />
  </div>
</template>
```

## AutoResize & Invalid

`autosize` grows with content. Pass `{ minRows, maxRows }` to clamp. `invalid` marks a validation failure.

```vue preview
<script setup lang="ts">
import { WiTextarea } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('Line 1\nLine 2')
const limited = ref('Clamped height')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <WiTextarea v-model="value" autosize label="Auto resize" />
    <WiTextarea v-model="limited" :autosize="{ minRows: 3, maxRows: 6 }" label="min 3 / max 6" />
    <WiTextarea invalid label="Required" help-text="This field is required" model-value="" />
  </div>
</template>
```

## Clearable & count

```vue preview
<script setup lang="ts">
import { WiTextarea } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('Draft notes')
</script>

<template>
  <WiTextarea v-model="value" label="Notes" clearable show-count :maxlength="120" :rows="3" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `helpText` | `string` | — | Helper text. |
| `invalid` | `boolean` | `false` | Invalid (validation failed) state. |
| `id` | `string` | — | Native id. |
| `rows` | `number` | `4` | Visible rows. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | CSS resize; forced to `none` when autosize is on. |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-grow with content; optional row clamp. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `maxlength` | `number` | — | Native maxlength. |
| `showCount` | `boolean` | `false` | Show character count. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Emitted when the value changes. |
| `clear` | — | Emitted when the value is cleared. |

## Slots

No slots.
