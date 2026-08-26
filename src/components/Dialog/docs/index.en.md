---
title: Dialog
category: 04 / OVERLAY
description: Modal dialog with preset footer actions, async close guards, and status type.
---

# Dialog

Modal dialog. Visibility uses `v-model` (`modelValue`), corresponding to `visible`.

## Import

```ts
import { WiDialog, WiButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="Open Dialog" @click="open = true" />
    <WiDialog v-model="open" header="Confirm" width="28rem">
      <p style="margin:0">Use <code>header</code> or <code>title</code> for the dialog title.</p>
    </WiDialog>
  </div>
</template>
```

## Positions

Supports `center` / `top` / `bottom` / `left` / `right` and the four corner positions.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)
const position = ref<'center' | 'top' | 'topright' | 'bottomleft'>('center')

function openAt(next: 'center' | 'top' | 'topright' | 'bottomleft') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
    <WiButton label="Center" size="small" @click="openAt('center')" />
    <WiButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <WiButton label="Top Right" size="small" @click="openAt('topright')" />
    <WiButton label="Bottom Left" size="small" severity="secondary" @click="openAt('bottomleft')" />
    <WiDialog v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">Dialog can dock to edges and corners.</p>
    </WiDialog>
  </div>
</template>
```

## Footer actions

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="With Footer" @click="open = true" />
    <WiDialog v-model="open" header="Save changes" width="28rem">
      <p style="margin:0">Footer slot is for primary and secondary actions.</p>
      <template #footer>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;width:100%">
          <WiButton label="Cancel" severity="secondary" text @click="open = false" />
          <WiButton label="Confirm" @click="open = false" />
        </div>
      </template>
    </WiDialog>
  </div>
</template>
```

## No dismiss mask

With `dismissableMask={false}` (or `closeOnOutsideClick={false}`), clicking the mask does not close the dialog.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="No Mask Dismiss" severity="secondary" @click="open = true" />
    <WiDialog v-model="open" header="Stay open" :dismissable-mask="false">
      <p style="margin:0">Click the mask — the dialog stays open. Use the close button or Esc.</p>
    </WiDialog>
  </div>
</template>
```

## Maximizable

`maximizable` adds a maximize / restore toggle in the title bar.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)
</script>

<template>
  <div>
    <WiButton label="Maximizable" @click="open = true" />
    <WiDialog v-model="open" header="Workspace" maximizable width="32rem">
      <p style="margin:0">Toggle maximize to fill the viewport.</p>
    </WiDialog>
  </div>
</template>
```

## Preset footer and async close

`positiveText` / `negativeText` render confirm / cancel buttons (`footer` slot wins). Return `false` (including from a Promise) to keep the dialog open. Use [ConfirmDialog](/components/ConfirmDialog) for accept/reject flows; Dialog `type` is a header icon only.

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiDialog } from '@well-insight/ui'

const open = ref(false)

async function save() {
  await new Promise((resolve) => setTimeout(resolve, 400))
}
</script>

<template>
  <div>
    <WiButton label="Save dialog" @click="open = true" />
    <WiDialog
      v-model="open"
      header="Save changes"
      type="info"
      positive-text="Save"
      negative-text="Cancel"
      :on-positive-click="save"
      :before-close="() => true"
      width="28rem"
    >
      <p style="margin:0">The close button, Esc, and mask run <code>beforeClose</code>; Save runs <code>onPositiveClick</code>.</p>
    </WiDialog>
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility. Use with `v-model` (corresponding to `visible`). |
| `title` | `string` | — | Title text. |
| `header` | `string` | — | Alias of `title`. |
| `closeOnEsc` | `boolean` | `true` | Close on Esc. |
| `blockScroll` | `boolean` | `true` | Lock page scroll while open (when `modal` is true). |
| `closeOnOutsideClick` | `boolean` | `true` | Close when clicking the mask. |
| `dismissableMask` | `boolean` | — | Alias of `closeOnOutsideClick`. |
| `closable` | `boolean` | `true` | Show the close button. |
| `maximizable` | `boolean` | `false` | Show the maximize / restore button. |
| `modal` | `boolean` | `true` | Overlay mask. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | Dialog position. |
| `width` | `string` | — | Dialog width (ignored when maximized). |
| `teleport` | `boolean` | `true` | Overlay Teleport; mounts to `body` by default. |
| `appendTo` | `string \| HTMLElement \| 'self'` | `'body'` | Mount target; `'self'` renders in place. |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | — | Status icon in the header; `warning` is an alias of `warn` |
| `positiveText` / `negativeText` | `string` | — | Preset footer buttons; ignored when the `footer` slot is used |
| `positiveSeverity` | `ButtonSeverity` | — | Confirm button severity |
| `onPositiveClick` / `onNegativeClick` | `(e) => unknown \| Promise<unknown>` | — | Return `false` to keep the dialog open |
| `beforeClose` | `() => unknown \| Promise<unknown>` | — | Runs before X / Esc / mask dismiss; return `false` to keep open |

## Events

| Event | Prop | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility change. |
| `close` | — | Emitted when closing. |
| `show` | — | Emitted when opening. |
| `hide` | — | Emitted after closing. |
| `maximize` | — | Enter maximize. |
| `unmaximize` | — | Exit maximize. |

## Slots

| Slot | Description |
| --- | --- |
| `default` | Dialog content. |
| `header` | Custom header area. |
| `footer` | Footer actions. |
