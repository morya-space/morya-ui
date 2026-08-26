---
title: InputPassword
category: 02 / FORM
description: Password input with show/hide toggle and optional strength feedback.
---

# InputPassword

Password input. Includes a show/hide toggle by default; optional password strength feedback.

## Import

```ts
import { WiInputPassword } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputPassword } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WiInputPassword v-model="value" label="Password" />
</template>
```

## Feedback

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputPassword } from '@well-insight/ui'

const value = ref('')
</script>

<template>
  <WiInputPassword v-model="value" label="Password" feedback />
</template>
```

## Custom icons

Defaults are `eye` / `eye-off`. Swap them with other system icons via props, or replace them entirely with slots.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiIcon, WiInputPassword } from '@well-insight/ui'

const byProp = ref('')
const bySlot = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;max-width:20rem">
    <WiInputPassword v-model="byProp" label="Via props" show-icon="unlock" hide-icon="lock" />
    <WiInputPassword v-model="bySlot" label="Via slots">
      <template #showIcon>
        <WiIcon name="search" size="sm" />
      </template>
      <template #hideIcon>
        <WiIcon name="close" size="sm" />
      </template>
    </WiInputPassword>
  </div>
</template>
```

## Hold to peek

`showPasswordOn="mousedown"` reveals while pressed and hides on release (Space / Enter do the same).

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputPassword } from '@well-insight/ui'

const value = ref('secret')
</script>

<template>
  <WiInputPassword v-model="value" label="Hold to peek" show-password-on="mousedown" />
</template>
```

## Clearable & count

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiInputPassword } from '@well-insight/ui'

const value = ref('draft-pass')
</script>

<template>
  <WiInputPassword v-model="value" label="Password" clearable show-count :maxlength="32" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | Bound value. |
| `label` | `string` | — | Label text. |
| `feedback` | `boolean` | `false` | Show strength feedback. |
| `toggleMask` | `boolean` | `true` | Show toggle for revealing the password. |
| `showPasswordOn` | `'click' \| 'mousedown'` | `'click'` | How to reveal; `mousedown` is hold-to-peek. |
| `showIcon` | `IconName \| Component` | `'eye'` | Icon while masked (click to reveal). |
| `hideIcon` | `IconName \| Component` | `'eye-off'` | Icon while visible (click to hide). |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | Size. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Visual variant. |
| `fluid` | `boolean` | `false` | Full width. |
| `invalid` | `boolean` | `false` | Validation failed state. |
| `disabled` | `boolean` | `false` | Disabled. |
| `readonly` | `boolean` | `false` | Read-only. |
| `clearable` | `boolean` | `false` | Show a clear button. |
| `maxlength` | `number` | — | Native maxlength. |
| `showCount` | `boolean` | `false` | Show character count. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Value changed. |
| `clear` | — | Emitted when the value is cleared. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `showIcon` | `{ unmasked }` | Replace the show-password icon. |
| `hideIcon` | `{ unmasked }` | Replace the hide-password icon. |
