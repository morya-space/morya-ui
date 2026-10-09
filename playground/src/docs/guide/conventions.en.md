---
title: Conventions
order: 35
description: Naming, semantic type, size, and theme conventions in morya-ui.
---

# Conventions

Morya UI has its own vocabulary: `M*` components, semantic `type` for tone on Badge / Tag / Status / Alert, Button appearance sugar `type` / `color` / `variant`, and `--m-*` design tokens. Follow these conventions when you assemble product UI.

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
| `type` (semantic) | Tone on Badge / Tag / Status / Alert / Message / Toast: `primary` / `secondary` / `success` / `info` / `warning` / `danger` |
| `type` / `color` / `variant` (Button) | Button: `type` sugar (`primary` / `dashed` / `text` / `link`…) + `color` + `variant` (`solid` / `outlined` / `filled`…) |
| `fluid` / `block` | Full width; fields mostly use `fluid`, Button / ButtonGroup use `block` |
| `size` | `small` / `medium` / `large` (some controls still accept `sm` / `md` / `lg`) |
| `status` | Field validation: `error` / `warning` |

Buttons default to gray outlined (`default` + `outlined`). Use `type="primary"` for solid primary, keep the default or `type="text"` for quiet actions, and `danger` / `color="danger"` for destructive ones.

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
