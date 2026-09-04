---
title: Accordion
category: 03 / DATA
description: Collapsible panel group. Supports single or multiple open panels; configure headers and disabled state via tabs.
---

# Accordion

Collapsible panels for organizing grouped content in limited space.

## Import

```ts
import { WdAccordion } from '@wex-design/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdAccordion } from '@wex-design/ui'
import { ref } from 'vue'

const active = ref('design')
const tabs = [
  { value: 'design', header: 'Design' },
  { value: 'code', header: 'Code' },
  { value: 'disabled', header: 'Disabled', disabled: true },
]
</script>

<template>
  <WdAccordion v-model="active" :tabs="tabs">
    <template #design>
      <p style="margin:0">
        Design system tokens and layout rules.
      </p>
    </template>
    <template #code>
      <p style="margin:0">
        Implementation notes and API contracts.
      </p>
    </template>
  </WdAccordion>
</template>
```

## Multiple

```vue preview
<script setup lang="ts">
import { WdAccordion } from '@wex-design/ui'
import { ref } from 'vue'

const active = ref<string[]>(['a'])
const tabs = [
  { value: 'a', header: 'Section A' },
  { value: 'b', header: 'Section B' },
]
</script>

<template>
  <WdAccordion v-model="active" multiple :tabs="tabs">
    <template #a>
      <p style="margin:0">
        First section content.
      </p>
    </template>
    <template #b>
      <p style="margin:0">
        Second section content.
      </p>
    </template>
  </WdAccordion>
</template>
```

## Extra

`#extra` renders to the right of the header; clicks do not toggle the panel.

```vue preview
<script setup lang="ts">
import { WdAccordion, WdButton } from '@wex-design/ui'
import { ref } from 'vue'

const active = ref('a')
const tabs = [
  { value: 'a', header: 'Section A' },
]
</script>

<template>
  <WdAccordion v-model="active" :tabs="tabs">
    <template #extra="{ tab }">
      <WdButton :label="tab.header" size="small" text />
    </template>
    <template #a>
      <p style="margin:0">
        Content.
      </p>
    </template>
  </WdAccordion>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[]` | — | Currently expanded tab key; an array when multiple is enabled. |
| `multiple` | `boolean` | `false` | Allow multiple panels to be expanded at once. |
| `tabs` | `{ value: string; header: string; disabled?: boolean }[]` | — | Panel list. |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | Fired when the expanded item(s) change. |

## Slots

| Slot | Description |
| --- | --- |
| `[tab.value]` | Panel content; slot name matches `tabs[].value`. |
| `extra` | Header extra, `{ tab }`; clicks do not collapse. |
