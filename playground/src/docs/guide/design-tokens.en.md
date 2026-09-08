---
title: Design tokens
order: 4.5
description: Full --wk-* CSS variable reference with defaults and usage notes.
---

# Design tokens

Wise Kit components consume semantic CSS variables (`--wk-*`) only. The catalog below is **auto-extracted** from `src/**/*.css`. Run `pnpm tokens:generate` to keep it in sync with source.

## Override mechanisms

| Mechanism | Purpose |
| --- | --- |
| `[data-theme="dark"]` | Light / dark theme |
| `[data-wk-density]` | Spacing and control height density |
| `[data-wk-motion]` | Motion duration preferences |
| `createWiseKit({ zIndex })` / `WkConfigProvider` | Writes globals such as `--wk-z-base` |

See [Theme](/docs/theme) for theme APIs and density behavior.

## Full catalog

```vue preview
<script setup lang="ts">
import DesignTokenCatalog from '../../components/DesignTokenCatalog.vue'
</script>

<template>
  <DesignTokenCatalog />
</template>
```

## Customization

Override variables at the app entry without forking components:

```css
:root {
  --wk-color-primary: #0f766e;
  --wk-radius-control: 6px;
}
```

Component-local tokens (for example `--wk-button-padding-x-medium`) live in each `styles.css` and can be overridden with higher-specificity selectors.
