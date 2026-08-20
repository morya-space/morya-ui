---
title: Quick start
order: 2
description: Install the package, import styles, and render the first component.
---

# Quick start

## Install

**In an application (npm / pnpm / yarn):**

```bash
pnpm add @well-insight/ui
```

Vue 3.5+ is required. Theme tokens, color-mode switching, and motion APIs are all included in `@well-insight/ui`.

After cloning this repository, run `pnpm install`. Development resolves source via `exports.development` for HMR.

## Import styles

Import the library stylesheet at the app entry:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App).mount('#app')
```

## Use a component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiInput } from '@well-insight/ui'

const name = ref('')
</script>

<template>
  <div style="display: grid; gap: 1rem; max-width: 20rem">
    <WiInput v-model="name" label="Name" placeholder="Enter a name" />
    <WiButton label="Submit" @click="() => undefined" />
  </div>
</template>
```

## Optional: app-level defaults

```ts
import { createApp } from 'vue'
import { createWellInsight } from '@well-insight/ui'
import App from './App.vue'
import '@well-insight/ui/styles.css'

createApp(App)
  .use(
    createWellInsight({
      appendTo: 'body',
      size: 'small',
      zIndex: 1100,
    }),
  )
  .mount('#app')
```

See [Configuration](/docs/config) for details.

## Theme API

Color-mode helpers come from the same package:

```ts
import { useTheme } from '@well-insight/ui'

const { toggleTheme } = useTheme()
```

See [Theme](/docs/theme).

## Run this docs site

```bash
pnpm --filter @well-insight/ui dev
# http://localhost:5182

# Build the static docs site
pnpm --filter @well-insight/ui build:docs
```
