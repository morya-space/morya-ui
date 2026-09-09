---
title: Design tokens
order: 4.5
description: Full --m-* CSS variable reference with defaults and usage notes.
---

# Design tokens

Morya UI components consume semantic CSS variables (`--m-*`) only. The catalog below is **auto-extracted** from `src/**/*.css`. Run `pnpm tokens:generate` to keep it in sync with source.

## Override mechanisms

| Mechanism | Purpose |
| --- | --- |
| `[data-theme="dark"]` | Light / dark theme |
| `[data-m-density]` | Spacing and control height density |
| `[data-m-motion]` | Motion duration preferences |
| `createMoryaUI({ zIndex })` / `MConfigProvider` | Writes globals such as `--m-z-base` |

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
  --m-color-primary: #0f766e;
  --m-radius-control: 6px;
}
```

Component-local tokens (for example `--m-button-padding-x-medium`) live in each `styles.css` and can be overridden with higher-specificity selectors.
