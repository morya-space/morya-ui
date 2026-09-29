---
title: antd component mapping
order: 8.5
description: Map ant-design component names to morya-ui with capability notes (keep morya API vocabulary).
---

# antd component mapping

When moving from ant-design (React) to morya-ui (Vue), map by **scenario / role**—do not copy APIs 1:1 by the same name.

## Principles

| Principle                        | Notes                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| Learn structure, don’t clone     | Match IA and docs completeness; do not clone antd skins or a full dumi site                       |
| Keep morya vocabulary            | Stick to `severity` / `variant` / `--m-*`; do not rename back to antd terms like `type="primary"` |
| Docs live in the Vite playground | Guides and component pages ship here—not via dumi                                                 |
| Don’t invent missing APIs        | “Boundaries” call out gaps; roadmap lives in repo `docs/antd-parity-roadmap.md`                   |

Also see: [Conventions](/docs/conventions), [Common Props](/docs/common-props), [Design](/docs/design), [Theme editor](/theme-editor).

## Component map

| antd                         | morya                                                                                                               | Role / usage                                                                          | Boundaries                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `FloatButton`                | [SpeedDial](/components/SpeedDial) / [ScrollTop](/components/ScrollTop) / [Dock](/components/Dock)                  | Floating action cluster → SpeedDial; back-to-top → ScrollTop; app launcher bar → Dock | No single `FloatButton`; pick by role                              |
| `Transfer`                   | [PickList](/components/PickList)                                                                                    | Dual-list value picking                                                               | Follow morya data/API—not antd Transfer props                      |
| `TimePicker`                 | [TimePicker](/components/TimePicker) (`MTimePicker`)                                                                | Same as `MDatePicker` with `type="time"`                                              | Prefer this entry; dates/ranges stay on DatePicker                 |
| `ColorPicker`                | [InputColor](/components/InputColor)                                                                                | Native color + swatches                                                               | Not a full antd panel (no full alpha-panel experience)             |
| `Cascader`                   | [CascadeSelect](/components/CascadeSelect)                                                                          | Single leaf selection                                                                 | No search / multi / `loadData` today                               |
| `App`                        | [ConfigProvider](/components/ConfigProvider) + `createMoryaUI` (installer) + `toast` / `message` / modal-style APIs | Theme / locale / feedback host                                                        | **`MApp` is not shipped**; use Provider + installer + service APIs |
| `DatePicker` / `RangePicker` | [DatePicker](/components/DatePicker) (`MDatePicker`)                                                                | Modes via `type`                                                                      | See table below                                                    |

### DatePicker `type` map

| antd scenario         | morya                                                 |
| --------------------- | ----------------------------------------------------- |
| Date                  | `type="date"` (default)                               |
| Range (`RangePicker`) | `type="daterange"`                                    |
| Date-time             | `type="datetime"`                                     |
| Date-time range       | `type="datetimerange"`                                |
| Time only             | `type="time"` or [TimePicker](/components/TimePicker) |
| Month / year          | `type="month"` / `type="year"`                        |

## Migration tips

1. **Pick by role first**: for floating UI, decide “back to top / action cluster / Dock”, then open that component doc.
2. **Translate vocabulary, keep intent**: `type="primary"` → `severity="primary"` (often omit); shape via `variant`.
3. **Split feedback**: short results → `message`; summary + detail / async → `toast`; confirms → Confirm family—don’t invent an `MApp` host.
4. **Check boundaries for gaps**: Cascader multi/search, full Color panel, unified App shell remain on the roadmap in repo `docs/antd-parity-roadmap.md`.
5. **Theme & shared props**: tune color/density in [/theme-editor](/theme-editor); cross-cutting props in [/docs/common-props](/docs/common-props).

## Related links

- [Design](/docs/design) · [Common Props](/docs/common-props) · [Conventions](/docs/conventions) · [Theme editor](/theme-editor)
- Components: [SpeedDial](/components/SpeedDial) · [ScrollTop](/components/ScrollTop) · [Dock](/components/Dock) · [PickList](/components/PickList) · [TimePicker](/components/TimePicker) · [DatePicker](/components/DatePicker) · [InputColor](/components/InputColor) · [CascadeSelect](/components/CascadeSelect) · [ConfigProvider](/components/ConfigProvider)
- Maintainer roadmap: repo `docs/antd-parity-roadmap.md`
