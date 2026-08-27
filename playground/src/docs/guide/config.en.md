---
title: Configuration
order: 5
description: ConfigProvider, createWellInsight, and useWiConfig.
---

# Configuration

Well Insight provides app-level and page-level defaults for overlay mount, size, density, and copy.

## Capabilities

| Field | Description |
| --- | --- |
| `appendTo` | Default overlay Teleport target, `body` by default |
| `size` | Default size for forms / buttons |
| `density` | `compact` / `comfortable` / `spacious`, scales spacing and control height |
| `inputVariant` | Input surface `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Confirm, empty, loading, and placeholder copy. Pass built-in packs `zhCN` / `enUS` |

Priority: **component props > `WiConfigProvider` > `createWellInsight` > built-in default (Chinese)**.

## Locale packs

Built-in copy defaults to Chinese. Pass `enUS` to switch to English:

```ts
import { createWellInsight, enUS, zhCN } from '@well-insight/ui'
import { createApp } from 'vue'

createApp(App).use(createWellInsight({ locale: enUS })).mount('#app')
```

You can also override a subset:

```ts
createWellInsight({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

The **中 / EN** switch in the docs header injects the same pack into `WiConfigProvider`, so live examples (empty states, confirm, dates, and so on) follow the selected language. Markdown pages load `*.en.md` when English is selected.

## Size

Controls without a local `size` inherit from ConfigProvider.

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiInput, WiSelect } from '@well-insight/ui'
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
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
        Default size
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WiButton label="Button" />
        <WiInput placeholder="Input" style="width:10rem" />
        <WiSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </div>
    <WiConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--wi-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WiButton label="Button" />
        <WiInput placeholder="Input" style="width:10rem" />
        <WiSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiInput } from '@well-insight/ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <WiButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <WiConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--wi-color-border);border-radius:var(--wi-radius-md)">
        <WiButton label="Save" />
        <WiInput placeholder="Nickname" style="width:12rem" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Input variant

```vue preview
<script setup lang="ts">
import { WiConfigProvider, WiInput, WiTextarea } from '@well-insight/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <WiConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wi-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <WiInput placeholder="Outlined input" />
        <WiTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </WiConfigProvider>
    <WiConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wi-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <WiInput placeholder="Filled input" />
        <WiTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </WiConfigProvider>
  </div>
</template>
```

## Locale

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiConfirmDialog, WiSelect } from '@well-insight/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WiConfigProvider
    :locale="{ selectPlaceholder: 'Pick a city', accept: 'OK', reject: 'Not now' }"
  >
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WiSelect v-model="city" :options="options" style="width:12rem" />
      <WiButton label="Open confirm" @click="confirmOpen = true" />
      <WiConfirmDialog
        v-model="confirmOpen"
        header="Confirm"
        message="Button labels come from locale.accept / reject."
      />
    </div>
  </WiConfigProvider>
</template>
```

## appendTo + zIndex

```vue preview
<script setup lang="ts">
import { WiButton, WiConfigProvider, WiDialog } from '@well-insight/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <WiConfigProvider append-to="body" :z-index="2200">
    <WiButton label="Open dialog" @click="visible = true" />
    <WiDialog v-model="visible" header="Mounted to body" width="24rem">
      <p style="margin:0">
        Overlays Teleport to body by default. The z-index base comes from ConfigProvider.
      </p>
    </WiDialog>
  </WiConfigProvider>
</template>
```

## App-level: `createWellInsight`

```ts
import { createWellInsight } from '@well-insight/ui'
import { createApp } from 'vue'

createApp(App).use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: 'OK', reject: 'Cancel' },
    }),
  ).mount('#app')
```

## Reading config

```ts
import { useWiConfig } from '@well-insight/ui'

const config = useWiConfig()
// config.value.appendTo / size / locale …
```

Full props and comparison tables: [ConfigProvider](/components/ConfigProvider).
