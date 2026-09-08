---
title: Configuration
order: 5
description: ConfigProvider, createWiseKit, and useWkConfig.
---

# Configuration

Wise Kit provides app-level and page-level defaults for overlay mount, size, density, and copy.

## Capabilities

| Field | Description |
| --- | --- |
| `appendTo` | Default overlay Teleport target, `body` by default |
| `size` | Default size for forms / buttons |
| `density` | `compact` / `comfortable` / `spacious`, scales spacing and control height |
| `inputVariant` | Input surface `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Confirm, empty, loading, and placeholder copy. Pass built-in packs `zhCN` / `enUS` |

Priority: **component props > `WkConfigProvider` > `createWiseKit` > built-in default (Chinese)**.

## Locale packs

Built-in copy defaults to Chinese. Pass `enUS` to switch to English:

```ts
import { createWiseKit, enUS, zhCN } from '@wise-kit/ui'
import { createApp } from 'vue'

createApp(App).use(createWiseKit({ locale: enUS })).mount('#app')
```

You can also override a subset:

```ts
createWiseKit({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

The **中 / EN** switch in the docs header injects the same pack into `WkConfigProvider`, so live examples (empty states, confirm, dates, and so on) follow the selected language. Markdown pages load `*.en.md` when English is selected.

## Size

Controls without a local `size` inherit from ConfigProvider.

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkInput, WkSelect } from '@wise-kit/ui'
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
      <p style="margin:0 0 0.5rem;color:var(--wk-color-text-muted);font-size:0.75rem">
        Default size
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WkButton label="Button" />
        <WkInput placeholder="Input" style="width:10rem" />
        <WkSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </div>
    <WkConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--wk-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <WkButton label="Button" />
        <WkInput placeholder="Input" style="width:10rem" />
        <WkSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </WkConfigProvider>
  </div>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkInput } from '@wise-kit/ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <WkButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <WkConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--wk-color-border);border-radius:var(--wk-radius-md)">
        <WkButton label="Save" />
        <WkInput placeholder="Nickname" style="width:12rem" />
      </div>
    </WkConfigProvider>
  </div>
</template>
```

## Input variant

```vue preview
<script setup lang="ts">
import { WkConfigProvider, WkInput, WkTextarea } from '@wise-kit/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <WkConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wk-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <WkInput placeholder="Outlined input" />
        <WkTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </WkConfigProvider>
    <WkConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--wk-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <WkInput placeholder="Filled input" />
        <WkTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </WkConfigProvider>
  </div>
</template>
```

## Locale

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkConfirmDialog, WkSelect } from '@wise-kit/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <WkConfigProvider
    :locale="{ selectPlaceholder: 'Pick a city', accept: 'OK', reject: 'Not now' }"
  >
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <WkSelect v-model="city" :options="options" style="width:12rem" />
      <WkButton label="Open confirm" @click="confirmOpen = true" />
      <WkConfirmDialog
        v-model="confirmOpen"
        header="Confirm"
        message="Button labels come from locale.accept / reject."
      />
    </div>
  </WkConfigProvider>
</template>
```

## appendTo + zIndex

```vue preview
<script setup lang="ts">
import { WkButton, WkConfigProvider, WkDialog } from '@wise-kit/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <WkConfigProvider append-to="body" :z-index="2200">
    <WkButton label="Open dialog" @click="visible = true" />
    <WkDialog v-model="visible" header="Mounted to body" width="24rem">
      <p style="margin:0">
        Overlays Teleport to body by default. The z-index base comes from ConfigProvider.
      </p>
    </WkDialog>
  </WkConfigProvider>
</template>
```

## App-level: `createWiseKit`

```ts
import { createWiseKit } from '@wise-kit/ui'
import { createApp } from 'vue'

createApp(App).use(
    createWiseKit({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: 'OK', reject: 'Cancel' },
    }),
  ).mount('#app')
```

## Reading config

```ts
import { useWkConfig } from '@wise-kit/ui'

const config = useWkConfig()
// config.value.appendTo / size / locale …
```

Full props and comparison tables: [ConfigProvider](/components/ConfigProvider).
