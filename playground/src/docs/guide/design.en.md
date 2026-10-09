---
title: Design language
order: 4.5
description: Entry to Morya design principles and Design Spec chapters.
---

# Design language

Morya UI is a **token-driven** Vue 3 library: color, spacing, radius, type, and motion share `--m-*` variables; interaction vocabulary uses `severity` / `variant` / `size`; global behavior is coordinated by `MConfigProvider`, `useTheme`, `useDensity`, and `useMotion`.

This page is the Design Spec hub. Principles come from [`design-kit/DESIGN.md`](https://github.com/morya-space/morya-ui/blob/main/design-kit/DESIGN.md); the full variable catalog is in [Design tokens](/docs/design-tokens).

## Principles

1. **Components first**: Prefer library `M*` controls over hand-rolled DOM equivalents.
2. **Tokens first**: App styles consume `--m-*` only; no raw `#hex` / `rgb()` in product CSS (change brand at the theme entry).
3. **Semantic consistency**: Primary actions use `type="primary"`; destructive work uses `danger` / `color="danger"` or a confirm flow.
4. **Accessibility**: Controls need accessible names; icon-only buttons need `aria-label`; overlays dismiss via keyboard.
5. **Single source of truth**: Trust component docs / MCP for APIs; do not invent props.

## Chapters

| Chapter                               | Focus                                                         |
| ------------------------------------- | ------------------------------------------------------------- |
| [Color](/docs/design-color)           | Brand, severity, neutrals, contrast, overrides                |
| [Typography](/docs/design-typography) | Type ramp, weights, control fonts                             |
| [Spacing](/docs/design-spacing)       | `--m-space-*` rhythm and density scaling                      |
| [Layout](/docs/design-layout)         | `MLayout` / `MPage*` / `MSpace` and app chrome                |
| [Motion](/docs/motion)                | Design principles, duration, easing, reduced motion, and APIs |
| [Feedback](/docs/design-feedback)     | Message / Toast / Dialog / Alert hierarchy                    |

Engineering guides: [Theme](/docs/theme), [Configuration](/docs/config), [Conventions](/docs/conventions), [Common Props](/docs/common-props).

## Theme editor

Live accent, density, and motion preview: [Theme editor](/theme-editor) (interactive route). Programmatic APIs: `createTheme` / `useTheme` — see [Theme](/docs/theme).
