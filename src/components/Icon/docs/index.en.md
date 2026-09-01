---
title: Icon
category: 01 / PRIMITIVE
description: System outline icon registry. Use the default slot for business icons from Lucide and similar libraries.
---

# Icon

`WiIcon` only maintains **component-library system icons** (close, arrows, status, actions, and so on). For full business icon sets, use the default slot with [Lucide](https://lucide.dev) or another library so hundreds of SVGs are not bundled into `@well-insight/ui`.

## Import

```ts
import { iconNames, WiIcon } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WiIcon } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WiIcon name="search" />
    <WiIcon name="check-circle" size="small" />
    <WiIcon name="warning" size="large" />
    <WiIcon name="loader" size="sm" label="Loading" />
  </div>
</template>
```

## All system icons

Click an icon to copy its name (for example `search`). Usage: `<WiIcon name="search" />`.

```vue preview
<script setup lang="ts">
import type {ToastMessage} from '@well-insight/ui';
import { iconNames,  WiIcon, WiInput, WiToast } from '@well-insight/ui'
import { computed, ref } from 'vue'

const query = ref('')
const copied = ref<string | null>(null)
const messages = ref<ToastMessage[]>([])
let toastSeq = 0
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return [...iconNames]
  return iconNames.filter((name) => name.toLowerCase().includes(q))
})

function itemStyle(name: string) {
  const active = copied.value === name
  return [
    'align-items:center',
    'background:var(--wi-color-surface)',
    `border:1px solid ${active ? 'var(--wi-color-primary)' : 'var(--wi-color-border)'}`,
    'border-radius:var(--wi-radius-control, 3px)',
    `color:${active ? 'var(--wi-color-primary)' : 'var(--wi-color-text)'}`,
    'cursor:pointer',
    'display:flex',
    'flex-direction:column',
    'font:inherit',
    'gap:0.65rem',
    'justify-content:center',
    'min-height:6.5rem',
    'padding:0.85rem 0.5rem',
    'width:100%',
  ].join(';')
}

async function copyName(name: string) {
  try {
    await navigator.clipboard.writeText(name)
  } catch {
    const area = document.createElement('textarea')
    area.value = name
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  copied.value = name
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    if (copied.value === name) copied.value = null
  }, 1200)

  const id = `icon-copy-${++toastSeq}`
  messages.value = [
    ...messages.value,
    {
      id,
      severity: 'success',
      summary: 'Copied',
      detail: name,
      closable: true,
    },
  ]
  window.setTimeout(() => {
    messages.value = messages.value.filter((item) => item.id !== id)
  }, 1600)
}

function onToastClose(message: ToastMessage) {
  messages.value = messages.value.filter((item) => item.id !== message.id)
}
</script>

<template>
  <div style="width:100%">
    <WiInput
      v-model="query"
      clearable
      fluid
      placeholder="Search icon names…"
      style="max-width: 20rem; margin-bottom: 1rem"
    >
      <template #prefix>
        <WiIcon name="search" size="sm" />
      </template>
    </WiInput>

    <p
      v-if="!filtered.length"
      style="color: var(--wi-color-text-muted); font-size: 0.875rem; margin: 0.5rem 0 0"
    >
      No matching icons
    </p>

    <div
      v-else
      style="display:grid;grid-template-columns:repeat(auto-fill,minmax(7.25rem,1fr));gap:0.75rem;width:100%"
    >
      <button
        v-for="name in filtered"
        :key="name"
        type="button"
        :style="itemStyle(name)"
        :title="`Click to copy ${name}`"
        @click="copyName(name)"
      >
        <WiIcon :name="name" size="large" />
        <span
          style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.72rem;line-height:1.3;max-width:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap"
        >
          {{ copied === name ? 'Copied' : name }}
        </span>
      </button>
    </div>

    <WiToast :messages="messages" position="top-right" @close="onToastClose" />
  </div>
</template>
```

## Custom / Lucide (recommended on the app side)

When system icons are not enough, do not pile SVGs into the component library. Mount any icon component through the default slot:

```vue
<script setup lang="ts">
import { WiButton, WiIcon, WiIconField, WiInput } from '@well-insight/ui'
import { User } from 'lucide-vue-next'
</script>

<template>
  <WiIcon label="User" size="md">
    <User :size="16" :stroke-width="1.8" />
  </WiIcon>

  <WiIconField>
    <template #icon>
      <WiIcon size="sm">
        <User :size="14" :stroke-width="1.8" />
      </WiIcon>
    </template>
    <WiInput placeholder="Search users" />
  </WiIconField>

  <!-- Button can also take a component directly without wrapping WiIcon -->
  <WiButton :icon="User" label="Profile" />
</template>
```

Install example: `pnpm add lucide-vue-next`. Prefer stroke width `1.75`–`2`, close to the system icon width of `1.8`.

When the default slot is present, it is **rendered first** and `name` is ignored.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `IconName` | — | System icon name; optional when a slot is provided. |
| `label` | `string` | — | Accessible name; omitted icons use `aria-hidden`. |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Size; `sm`/`lg` map to small/large. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Custom SVG / third-party icon component. |

## Utility exports

| Export | Description |
| --- | --- |
| `iconNames` | Array of all system icon names. |
| `iconRegistry` / `getIconDefinition` / `isIconName` | Registry and type guards. |

## Events

No custom events.
