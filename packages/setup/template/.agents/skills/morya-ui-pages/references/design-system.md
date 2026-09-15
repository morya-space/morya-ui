# Design system (consumer summary)

Canonical long form lives in project-root `DESIGN.md` when the AI config pack is merged. This file is the portable subset for agents.

## Principles

1. **Components first** — layout, forms, tables, overlays use `M*` from `morya-ui`, not equivalent hand-rolled DOM.
2. **Tokens first** — color, space, radius, shadow, motion via `--m-*`. No raw `#hex` / `rgb()` in page styles.
3. **Semantic actions** — primary work uses `MButton severity="primary"`; destructive uses `severity="danger"` or confirm dialogs.
4. **Accessibility** — fields have visible labels; icon buttons have `aria-label`; overlays dismiss with Esc (library default).
5. **ConfigProvider** — wrap the app (or isolated demo) in `MConfigProvider` for locale, theme, density, overlay mount.

## App shell

```vue
<script setup lang="ts">
import { MConfigProvider, zhCN } from 'morya-ui'
import 'morya-ui/styles.css'
</script>

<template>
  <MConfigProvider :locale="zhCN">
    <MLayout fill-viewport has-sider>
      <MLayoutSider bordered>...</MLayoutSider>
      <MLayout>
        <MLayoutHeader>...</MLayoutHeader>
        <MLayoutContent>...</MLayoutContent>
      </MLayout>
    </MLayout>
  </MConfigProvider>
</template>
```

| Role | Prefer |
| --- | --- |
| Admin chrome | `MLayout fillViewport` + sider / header / content |
| Page stack | `MPageContent` inside `MLayoutContent` |
| Filters / toolbar | `MPageFilters` + `MPageToolbar` |
| Form surfaces | `MPageHeader` + `MPageSection variant="form|actions"` |
| Dashboard KPI | `MPageStat` + `MPagePlaceholder` |
| Module cards | `MCard` / `MPanel` / `MFieldset` |
| Grid / spacing | `MGrid` + `MGridItem`, or `MFlex` / `MSpace` |

## Forms

- `MForm` + `MFormItem` with `name` aligned to rules.
- Prefer field props (`label`, `invalid`, `helpText`) when the control supports them; wrap with `MFormItem` for denser / complex forms.
- Default size medium; dense apps may use `size="small"` or ConfigProvider density.
- Form pages: keep the main column narrow (`MPageContent width="narrow"` or ~`40rem`).

## Data display

- `MTable` with columns + data + `row-key`.
- Row actions: text/link `MButton` or `MDropdown`.
- Pagination: table `paginator` or sibling `MPagination`.
- Empty states: `MEmpty` in `#empty` / Flow golden — never a silent blank table.
- Terminal outcomes (success / 403 / 404 / 500): `MResult` — do not reuse `MEmpty` for errors.

## Overlays

| Need | Component |
| --- | --- |
| Delete confirm | `MConfirmDialog` / `MConfirmPopup` |
| Detail / edit modal | `MDialog` |
| Side filter / detail | `MDrawer` |
| Field hint | `MTooltip` |

## Token cheat sheet

| Use | Variable |
| --- | --- |
| Page background | `--m-color-surface` |
| Body text | `--m-color-text` |
| Muted text | `--m-color-text-muted` |
| Border | `--m-color-border` |
| Brand / link | `--m-color-primary` |
| Danger | `--m-color-danger` |
| Section gap | `--m-space-4` / `--m-space-6` |
| Card radius | `--m-radius-md` |
| Card shadow | `--m-shadow-md` |

Full machine-readable set: project `design-tokens/tokens.json` (runtime truth remains `morya-ui/styles.css`).

## Bans

- Second UI library on the same page.
- Hard-coded theme colors that break `[data-theme="dark"]`.
- `<div @click>` instead of `MButton` / `<button>`.
- Using `MDropdown` for form enum selection (use `MSelect` / `MTreeSelect`).
- Skipping `import 'morya-ui/styles.css'`.
