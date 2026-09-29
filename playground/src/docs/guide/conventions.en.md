---
title: Conventions
order: 35
description: Naming, severity, size, and theme conventions in morya-ui.
---

# Conventions

Morya UI has its own vocabulary: `M*` components, `severity` for tone, `variant` for appearance, and `--m-*` design tokens. Follow these conventions when you assemble product UI.

## Components and tokens

| Convention | Meaning |
| --- | --- |
| Names | Always `M` prefix: `MButton`, `MDialog`, `MTable` |
| Theme | `MConfigProvider` plus `useTheme` / `useDensity` / `useMotion` |
| Color and geometry | `--m-*` only; brand via `--m-color-primary` |
| Control height | Medium default `32px`; radius `--m-control-radius` |
| Type weight | Control copy defaults to 400 |

See [Design tokens](/docs/design-tokens) and [Theme](/docs/theme).

## Tone and appearance

| Word | Use |
| --- | --- |
| `severity` | Semantic color: `primary` / `secondary` / `success` / `info` / `warning` / `danger` |
| `variant` | Appearance: `outlined` / `dashed` / `text` / `link` / `ghost`, etc. |
| `fluid` | Full width of the parent |
| `size` | `small` / `medium` / `large` (some controls still accept `sm` / `md` / `lg`) |
| `status` | Field validation: `error` / `warning` |

The default button is a solid primary action. Use `severity="secondary"` for quiet actions and `severity="danger"` for destructive ones.

## Feedback

| Situation | Use |
| --- | --- |
| Short result | `message` / `MMessage` |
| Summary + detail, or async work | `toast` / `MToast` |
| Confirm | `MConfirmDialog` / `MConfirmPopup` / `useConfirm` |
| Persistent in-page notice | `MAlert` |
| Blocking wait | `MLoading` (`MProgressSpinner` for a thin ring) |
| Progress | `MProgressBar` |
| Empty / outcome | `MEmpty` / `MResult` |

## Layout and pages

Admin chrome uses the `MLayout` family; list/filter/stat blocks use `MPage*`. Spacing containers are `MSpace` / `MFlex` / `MGrid`. Join adjacent buttons with `MButtonGroup`.

## Distinctive surfaces

Dock, Terminal, Knob, the Page kit, and MCP / Agent Skill sit on the same token system. Prefer the [component docs](/components/Button) and repository `DESIGN.md` when choosing APIs.
