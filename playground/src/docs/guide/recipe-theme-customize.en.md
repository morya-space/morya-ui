---
title: Theme customize
order: 24
description: Light/dark, density, and createTheme brand color in one practical path.
---

# Theme customize

Theme APIs ship in `morya-ui`: `useTheme` / `useDensity` for light-dark and density, `createTheme` to derive `--m-*` from a seed. This recipe is the shortest production path.

## Goal

- Toggle light / dark
- Switch `compact` / `comfortable` / `spacious`
- Change the brand primary with `createTheme({ seed: { colorPrimary } })`, and clean up temporary overrides

## When to use

- The product needs a brand accent or a light/dark toggle
- The same components should feel compact in consoles and roomier on forms
- You want to validate a seed locally before writing `:root` or a scoped host

## Steps

1. **Light / dark**: `useTheme().setTheme('light' | 'dark')` (writes `data-theme` on `document.documentElement`). Prefer root `MConfigProvider :theme` for SSR first paint.
2. **Density**: `useDensity().setDensity(...)`, or `MConfigProvider density` / `createMoryaUI({ density })`. For local demos set `:global-density="false"`.
3. **Primary**:

```ts
import { createTheme } from "morya-ui";

const theme = createTheme({
  seed: { colorPrimary: "#0b6e4f", borderRadius: 8 },
  // algorithm: 'dark' | 'compact' | ['dark', 'compact']
});
theme.apply(); // defaults to :root; pass an HTMLElement for scoped theming
// const dispose = theme.inject()  // <style data-m-theme> for component overrides
```

4. Live tuning & export: [Theme editor](/theme-editor); full catalog: [Design tokens](/docs/design-tokens).

## Preview

```vue preview src="./demos/recipes/ThemeCustomize.en.vue"

```

Light/dark uses global `useTheme`; density is scoped with `MConfigProvider`; primary only writes brand CSS vars onto the preview node and clears them on unmount so the docs shell stays clean. In apps, call `theme.apply()` / `inject()` directly.

## Checklist

- [ ] `morya-ui/styles.css` is imported (ships default `--m-*`)
- [ ] SSR first paint uses Provider / cookie to avoid flash
- [ ] Local demos set `:global-density="false"` so the whole site density is untouched
- [ ] Temporary `apply` / `inject` has matching `remove` / `dispose`
- [ ] Size, locale, and overlays stay on [Configuration](/docs/config) alongside visual theme

## Related

- [Theme](/docs/theme) · [Design tokens](/docs/design-tokens) · [Motion](/docs/motion)
- [Theme editor](/theme-editor)
- [Configuration](/docs/config) · [Admin layout](/docs/recipe-admin-layout)
