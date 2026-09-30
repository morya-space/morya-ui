---
title: Learning path
order: 1.5
description: Three tiers—5 minutes, half hour, go deeper—from install to theme, recipes, and customization.
---

# Learning path

Aimed first at **app developers**, then theme customizers; Agent / LLM entry is at the end. Pick one tier for the time you have—no need to read top to bottom.

## 5-minute start

Install the library and render a first component.

1. Add the dependency (or use the one-shot script): [Quick start](/docs/quick-start), [One-shot setup](/docs/setup)
2. Import styles; register or import on demand
3. Render `Button`, `Input`, and similar basics so theme styles are clearly applied
4. Browse the [component catalog](/components) for APIs you need

| Goal                         | Doc                              |
| ---------------------------- | -------------------------------- |
| Install + minimal example    | [Quick start](/docs/quick-start) |
| One-shot install + AI config | [One-shot setup](/docs/setup)    |
| Component index              | [Components](/components)        |

## Half-hour integration

Ship one business page: theme, global config, styling conventions, then one recipe.

1. [Theme](/docs/theme): light/dark and density; dig into [Design tokens](/docs/design-tokens) when needed
2. [Configuration](/docs/config): `ConfigProvider` / `createMoryaUI`
3. [Styling & attrs](/docs/attrs): fallthrough, `pt`, event placement (optional: [Common Props](/docs/common-props))
4. Follow one recipe:
   - [Login form](/docs/recipe-form-login)
   - [Table filter](/docs/recipe-table-filter)

| Goal                 | Doc                                                                               |
| -------------------- | --------------------------------------------------------------------------------- |
| Light/dark / density | [Theme](/docs/theme)                                                              |
| Global behavior      | [Configuration](/docs/config)                                                     |
| class / style / `pt` | [Styling & attrs](/docs/attrs)                                                    |
| Recipes              | [Login form](/docs/recipe-form-login) · [Table filter](/docs/recipe-table-filter) |

## Go deeper

Align design language, motion, SSR, accessibility, or agents.

| Direction                 | Doc                                  |
| ------------------------- | ------------------------------------ |
| Principles & chapters     | [Design language](/docs/design)      |
| Full `--m-*` catalog      | [Design tokens](/docs/design-tokens) |
| Intensity & presets       | [Motion](/docs/motion)               |
| Nuxt / Astro / etc.       | [SSR](/docs/ssr)                     |
| Keyboard, forms, overlays | [Accessibility](/docs/accessibility) |
| Agents / LLMs             | [For agents](/docs/for-agents)       |

Live theme preview: [Theme editor](/theme-editor).
