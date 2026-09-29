---
title: Spacing
order: 4.53
description: Spacing scale, density scaling, and control padding.
---

# Spacing

Vertical and horizontal rhythm share `--m-space-*`. When `useDensity` writes `data-m-density`, spacing and control heights scale together—no per-page compact hacks.

## Principles

- **Use the scale, not magic numbers**: Prefer `--m-space-4` / `--m-space-6` between sections; `1`–`3` inside tight groups.
- **Set density once**: `compact` | `comfortable` | `spacious` via `useDensity` / `MConfigProvider` / `createMoryaUI`.
- **Control padding is separate**: `--m-control-padding-x-*`, `--m-button-padding-x-*`—do not stretch controls with the space scale.
- **Layout primitives own rhythm**: Nest with `MSpace` / `MFlex` / `MGrid` — see [Layout](/docs/design-layout).

## Scale (comfortable / default)

| Token | Value | Typical use |
| --- | --- | --- |
| `--m-space-1` | `0.25rem` | Icon–label gap, ultra-tight |
| `--m-space-2` | `0.5rem` | Inside control groups |
| `--m-space-3` | `0.75rem` | Inside field blocks |
| `--m-space-4` | `1rem` | Default content gap |
| `--m-space-5` | `1.25rem` | Block breathing room |
| `--m-space-6` | `1.5rem` | Section gap |
| `--m-space-8` | `2rem` | Large section / page edge |

`compact` example: `--m-space-4` → `0.85rem`, `--m-control-height-medium` → `28px`.  
`spacious` example: `--m-space-4` → `1.15rem`, medium height → `40px`.

## Density API

```ts
import { useDensity } from 'morya-ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

App-level: `createMoryaUI({ density: 'compact' })` or `<MConfigProvider density="compact">`. See [Theme](/docs/theme) and [Configuration](/docs/config).

## Radius (often tuned with spacing)

| Token | Role |
| --- | --- |
| `--m-radius-control` / `--m-border-radius` | Inputs / buttons |
| `--m-radius-sm` | Small tags, badges |
| `--m-radius-md` / `--m-radius-lg` | Cards, panels |
| `--m-radius-full` | Pill / circle |

## Do / Don't

| Do | Don't |
| --- | --- |
| Align siblings on one step (e.g. `space-4` in a card) | Mix ad-hoc `8px` / `12px` / `14px` |
| Share density across filters and tables | Fake compact with `transform: scale` |
| Full-width actions via `fluid` + outer space | Huge margins to “center” a button |

Next: [Layout](/docs/design-layout).
