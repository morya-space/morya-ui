---
title: Icon
category: 01 / PRIMITIVE
description: System outline icon registry. Use the default slot for business icons from Lucide and similar libraries.
---

# Icon

`WdIcon` only maintains **component-library system icons** (close, arrows, status, actions, and so on). For full business icon sets, use the default slot with [Lucide](https://lucide.dev) or another library so hundreds of SVGs are not bundled into `@well-insight/ui`.

## Import

```ts
import { WdIcon, iconNames } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { WdIcon } from '@well-insight/ui'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
    <WdIcon name="search" />
    <WdIcon name="check-circle" size="small" />
    <WdIcon name="warning" size="large" />
    <WdIcon name="loader" size="sm" label="Loading" />
  </div>
</template>
```

## All system icons

Click an icon to copy its name (for example `search`). Usage: `<WdIcon name="search" />`.

```vue preview
<script setup lang="ts">
import { computed, ref } from 'vue'
import { WdIcon, WdInput, WdToast, iconNames, type ToastMessage } from '@well-insight/ui'

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
    'background:var(--wd-color-surface)',
    `border:1px solid ${active ? 'var(--wd-color-primary)' : 'var(--wd-color-border)'}`,
    'border-radius:var(--wd-radius-control, 3px)',
    `color:${active ? 'var(--wd-color-primary)' : 'var(--wd-color-text)'}`,
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
    <WdInput
      v-model="query"
      clearable
      fluid
      placeholder="Search icon names…"
      style="max-width: 20rem; margin-bottom: 1rem"
    >
      <template #prefix>
        <WdIcon name="search" size="sm" />
      </template>
    </WdInput>

    <p
      v-if="!filtered.length"
      style="color: var(--wd-color-text-muted); font-size: 0.875rem; margin: 0.5rem 0 0"
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
        <WdIcon :name="name" size="large" />
        <span
          style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.72rem;line-height:1.3;max-width:100%;overflow:hidden;text-align:center;text-overflow:ellipsis;white-space:nowrap"
        >
          {{ copied === name ? 'Copied' : name }}
        </span>
      </button>
    </div>

    <WdToast :messages="messages" position="top-right" @close="onToastClose" />
  </div>
</template>
```

## Custom / Lucide (recommended on the app side)

When system icons are not enough, do not pile SVGs into the component library. Mount any icon component through the default slot:

```vue
<script setup lang="ts">
import { User } from 'lucide-vue-next'
import { WdIcon, WdButton, WdIconField, WdInput } from '@well-insight/ui'
</script>

<template>
  <WdIcon label="User" size="md">
    <User :size="16" :stroke-width="1.8" />
  </WdIcon>

  <WdIconField>
    <template #icon>
      <WdIcon size="sm"><User :size="14" :stroke-width="1.8" /></WdIcon>
    </template>
    <WdInput placeholder="Search users" />
  </WdIconField>

  <!-- Button can also take a component directly without wrapping WdIcon -->
  <WdButton :icon="User" label="Profile" />
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
