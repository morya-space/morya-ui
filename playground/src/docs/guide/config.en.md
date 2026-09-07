---
title: Configuration
order: 5
description: ConfigProvider, createRoostDesign, and useRdConfig.
---

# Configuration

Roost Design provides app-level and page-level defaults for overlay mount, size, density, and copy.

## Capabilities

| Field | Description |
| --- | --- |
| `appendTo` | Default overlay Teleport target, `body` by default |
| `size` | Default size for forms / buttons |
| `density` | `compact` / `comfortable` / `spacious`, scales spacing and control height |
| `inputVariant` | Input surface `outlined` / `filled` |
| `zIndex` | Overlay z-index base |
| `locale` | Confirm, empty, loading, and placeholder copy. Pass built-in packs `zhCN` / `enUS` |

Priority: **component props > `RdConfigProvider` > `createRoostDesign` > built-in default (Chinese)**.

## Locale packs

Built-in copy defaults to Chinese. Pass `enUS` to switch to English:

```ts
import { createRoostDesign, enUS, zhCN } from '@roost-design/ui'
import { createApp } from 'vue'

createApp(App).use(createRoostDesign({ locale: enUS })).mount('#app')
```

You can also override a subset:

```ts
createRoostDesign({
  locale: {
    ...zhCN,
    accept: 'OK',
  },
})
```

The **中 / EN** switch in the docs header injects the same pack into `RdConfigProvider`, so live examples (empty states, confirm, dates, and so on) follow the selected language. Markdown pages load `*.en.md` when English is selected.

## Size

Controls without a local `size` inherit from ConfigProvider.

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput, RdSelect } from '@roost-design/ui'
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
      <p style="margin:0 0 0.5rem;color:var(--rd-color-text-muted);font-size:0.75rem">
        Default size
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <RdButton label="Button" />
        <RdInput placeholder="Input" style="width:10rem" />
        <RdSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </div>
    <RdConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--rd-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
        <RdButton label="Button" />
        <RdInput placeholder="Input" style="width:10rem" />
        <RdSelect v-model="city" :options="options" style="width:10rem" />
      </div>
    </RdConfigProvider>
  </div>
</template>
```

## Density

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdInput } from '@roost-design/ui'
import { ref } from 'vue'

const density = ref<'compact' | 'comfortable' | 'spacious'>('compact')
</script>

<template>
  <div style="display:grid;gap:0.75rem">
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <RdButton
        v-for="item in (['compact', 'comfortable', 'spacious'] as const)"
        :key="item"
        :label="item"
        :outlined="density !== item"
        size="small"
        @click="density = item"
      />
    </div>
    <RdConfigProvider :density="density" :global-density="false">
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;padding:0.75rem;border:1px solid var(--rd-color-border);border-radius:var(--rd-radius-md)">
        <RdButton label="Save" />
        <RdInput placeholder="Nickname" style="width:12rem" />
      </div>
    </RdConfigProvider>
  </div>
</template>
```

## Input variant

```vue preview
<script setup lang="ts">
import { RdConfigProvider, RdInput, RdTextarea } from '@roost-design/ui'
</script>

<template>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">
    <RdConfigProvider input-variant="outlined">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--rd-color-text-muted)">
        outlined
      </p>
      <div style="display:grid;gap:0.5rem">
        <RdInput placeholder="Outlined input" />
        <RdTextarea placeholder="Outlined textarea" :rows="2" />
      </div>
    </RdConfigProvider>
    <RdConfigProvider input-variant="filled">
      <p style="margin:0 0 0.5rem;font-size:0.75rem;color:var(--rd-color-text-muted)">
        filled
      </p>
      <div style="display:grid;gap:0.5rem">
        <RdInput placeholder="Filled input" />
        <RdTextarea placeholder="Filled textarea" :rows="2" />
      </div>
    </RdConfigProvider>
  </div>
</template>
```

## Locale

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdConfirmDialog, RdSelect } from '@roost-design/ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <RdConfigProvider
    :locale="{ selectPlaceholder: 'Pick a city', accept: 'OK', reject: 'Not now' }"
  >
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center">
      <RdSelect v-model="city" :options="options" style="width:12rem" />
      <RdButton label="Open confirm" @click="confirmOpen = true" />
      <RdConfirmDialog
        v-model="confirmOpen"
        header="Confirm"
        message="Button labels come from locale.accept / reject."
      />
    </div>
  </RdConfigProvider>
</template>
```

## appendTo + zIndex

```vue preview
<script setup lang="ts">
import { RdButton, RdConfigProvider, RdDialog } from '@roost-design/ui'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <RdConfigProvider append-to="body" :z-index="2200">
    <RdButton label="Open dialog" @click="visible = true" />
    <RdDialog v-model="visible" header="Mounted to body" width="24rem">
      <p style="margin:0">
        Overlays Teleport to body by default. The z-index base comes from ConfigProvider.
      </p>
    </RdDialog>
  </RdConfigProvider>
</template>
```

## App-level: `createRoostDesign`

```ts
import { createRoostDesign } from '@roost-design/ui'
import { createApp } from 'vue'

createApp(App).use(
    createRoostDesign({
      appendTo: 'body',
      size: 'small',
      zIndex: 2000,
      locale: { accept: 'OK', reject: 'Cancel' },
    }),
  ).mount('#app')
```

## Reading config

```ts
import { useRdConfig } from '@roost-design/ui'

const config = useRdConfig()
// config.value.appendTo / size / locale …
```

Full props and comparison tables: [ConfigProvider](/components/ConfigProvider).
