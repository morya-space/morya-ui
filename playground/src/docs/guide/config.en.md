---
title: Configuration
order: 5
description: ConfigProvider, createMoryaUI, and useMConfig.
---

# Configuration

Morya UI provides app-level and page-level defaults for overlay mount, size, density, and copy.

## Capabilities

| Field | Description |
| --- | --- |
| `appendTo` | Default overlay Teleport target, `body` by default |
| `size` | Default size for forms / buttons |
| `density` | `compact` / `comfortable` / `spacious`, scales spacing and control height |
| `inputVariant` | Input surface `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Confirm, empty, loading, and placeholder copy. Pass built-in packs `zhCN` / `enUS` |

Priority: **component props > `MConfigProvider` > `createMoryaUI` > built-in default (Chinese)**.

## Locale packs

Built-in copy defaults to Chinese. Pass `enUS` to switch to English:

```ts
import { createMoryaUI, enUS, zhCN } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(createMoryaUI({ locale: enUS })).mount('#app')
```

You can also override a subset:

```ts
createMoryaUI({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

The **中 / EN** switch in the docs header injects the same pack into `MConfigProvider`, so live examples (empty states, confirm, dates, and so on) follow the selected language. Markdown pages load `*.en.md` when English is selected.

## Size

Controls without a local `size` inherit from ConfigProvider.

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <div style="display:grid;gap:1rem">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted);font-size:0.75rem">
        Default size
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <MButton label="Button" />
        <MInput placeholder="Input" style="width:10rem" />
        <MSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </div>
    <MConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <MButton label="Button" />
        <MInput placeholder="Input" style="width:10rem" />
        <MSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </MConfigProvider>
  </div>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MInput } from 'morya-ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <MButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <MConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        <MButton label="Save" />
        <MInput placeholder="Nickname" style="width:12rem" />
      </div>
    </MConfigProvider>
  </div>
</template>
```

## Input variant

```vue preview
<script setup lang="ts">
import { MConfigProvider, MInput, MTextarea } from 'morya-ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <MConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--m-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <MInput placeholder="Outlined input" />
        <MTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </MConfigProvider>
    <MConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--m-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <MInput placeholder="Filled input" />
        <MTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </MConfigProvider>
  </div>
</template>
```

## Locale

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MConfirmDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider
    :locale="{ selectPlaceholder: 'Pick a city', accept: 'OK', reject: 'Not now' }"
  >
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <MSelect v-model="city" :options="options" style="width:12rem" />
      <MButton label="Open confirm" @click="confirmOpen = true" />
      <MConfirmDialog
        v-model="confirmOpen"
        header="Confirm"
        message="Button labels come from locale.accept / reject."
      />
    </div>
  </MConfigProvider>
</template>
```

## appendTo + zIndex

```vue preview
<script setup lang="ts">
import { MButton, MConfigProvider, MDialog } from 'morya-ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MConfigProvider append-to="body" :z-index="2200">
    <MButton label="Open dialog" @click="visible = true" />
    <MDialog v-model="visible" header="Mounted to body" width="24rem">
      <p style="margin:0">
        Overlays Teleport to body by default. The z-index base comes from ConfigProvider.
      </p>
    </MDialog>
  </MConfigProvider>
</template>
```

## App-level: `createMoryaUI`

```ts
import { createMoryaUI } from 'morya-ui'
import { createApp } from 'vue'

createApp(App).use(
    createMoryaUI({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: 'OK', reject: 'Cancel' },
    }),
  ).mount('#app')
```

## Reading config

```ts
import { useMConfig } from 'morya-ui'

const config = useMConfig()
// config.value.appendTo / size / locale …
```

Full props and comparison tables: [ConfigProvider](/components/ConfigProvider).
