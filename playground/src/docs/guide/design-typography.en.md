---
title: Typography
order: 4.52
description: Type ramp, weights, control fonts, and CJK/Latin mixing.
---

# Typography

Type tokens come in two layers: the **component text ramp** (`--m-font-size-xs` … `lg`) and the **display ramp** (`xl` … `3xl` for titles / KPIs). Control fonts use `--m-control-font-*` and may scale with density.

## Principles

- Body defaults to ~`14px` (`--m-font-size-md` / `--m-font-size`); control copy defaults to weight `400` (`--m-font-weight`).
- Hierarchy comes from the ramp and weight—not random zoom or full-page bold.
- Brand fonts override `--m-font-sans` (or seed `fontFamily`); components keep consuming tokens.
- Prefer the system stack for CJK/Latin mixes; keep Chinese fallbacks when customizing.

## Type ramp

| Token | Approx. | Role |
| --- | --- | --- |
| `--m-font-size-xs` | `0.75rem` | Meta, small tags |
| `--m-font-size-sm` | `0.8125rem` | Secondary notes, compact tables |
| `--m-font-size-md` | `0.875rem` (14px) | Default component text |
| `--m-font-size-lg` | `1.125rem` | Section titles |
| `--m-font-size-xl` | `1.25rem` | Page subtitles |
| `--m-font-size-2xl` | `1.5rem` | Page titles |
| `--m-font-size-3xl` | `1.75rem` | Display / KPIs |

Family: `--m-font-sans` (system UI stack + Noto Sans / emoji).

## Weights

| Token | Value | Role |
| --- | --- | --- |
| `--m-font-weight` | `400` | Default controls & body |
| `--m-font-weight-medium` | `500` | Emphasized labels, nav items |
| `--m-font-weight-strong` | `600` | Titles, key figures |

If a component overrides `--m-button-font-weight`, keep it local and restrained.

## Control fonts (size / density)

Comfortable (`:root`) heights (rewritten under `compact` / `spacious`):

| Size | Height token | Font token |
| --- | --- | --- |
| `small` | `--m-control-height-small` (24px) | `--m-control-font-small` (14px) |
| `medium` | `--m-control-height-medium` (32px) | `--m-control-font-medium` (14px) |
| `large` | `--m-control-height-large` (40px) | `--m-control-font-large` (15px) |

`size` also accepts `sm` / `md` / `lg` aliases; when omitted it inherits [Configuration](/docs/config) `size`. See [Theme](/docs/theme).

## Do / Don't

| Do | Don't |
| --- | --- |
| Display ramp for titles; body at `md` | Too many sizes on one screen |
| Emphasize with `medium` / `strong` | Bold entire paragraphs for hierarchy |
| `aria-label` on icon-only buttons | Shrink type until secondary copy fails readability |
| Headers / meta at `sm` + muted color | Ultra-light gray as a fake disabled state |

Catalog: [Design tokens](/docs/design-tokens). Next: [Spacing](/docs/design-spacing).
