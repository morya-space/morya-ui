# Page layouts

When generating a full page, pick a type and **mirror the golden-page block order**. Source: MCP `get_golden_page`.

| Type | `get_golden_page` id |
| --- | --- |
| List | `list-page` |
| Form (long / dedicated) | `form-page` |
| List create/edit dialog | `form-in-dialog` |
| Detail | `detail-page` |
| Dashboard | `dashboard-page` |
| Login | `login-page` |
| Landing | `landing-page` |
| Empty | `empty-state` |
| Result / 403 / terminal | `result-page` |
| Settings | `settings-page` |
| Wizard | `wizard-form` |

Via MCP: `recommend_page` → `get_golden_page`; local edits: `get_page_snippet` (`filters`, `toolbar`, `form-actions`, `scrollable-panel`, …).

## Product defaults

- **Short create/edit** (about ≤8 fields, single section): same-page `MDialog` + `MForm` — do not invent a new route form for every entity.
- **Long / multi-section / wizard**: dedicated form page (`form-page`) or `MDrawer`.
- **One-line success/error**: `message` API; title + detail or async notify → `toast` (see [feedback.md](feedback.md)).

## List page — block order

1. `MLayout fillViewport` + optional `MLayoutSider bordered`
2. Sider `MMenu` (**every item has `icon`**)
3. `MLayoutHeader` → `MBreadcrumb`
4. `MLayoutContent` → `MPageContent`
5. `MPageHeader` — page title + `#actions` primary (**one** filled primary in viewport)
6. `MPageFilters` — `variant="filled"` optional; inner `MSpace wrap` + Input/Select + query/reset (query/reset → secondary); optional `collapsible` + `#advanced` for secondary fields
7. Optional `MPageFilterChips` + closable `MTag` when filters are applied (after filters, before table)
8. Optional `MPageToolbar` — batch actions only (no page title)
9. `MTable` directly in content (usually **no** wrapping `MCard`); status → `MStatus`; `#empty` → `MEmpty`
10. Pagination via `MTable` paginator or sibling `MPagination`
11. Short create/edit → `MDialog` + `MForm` on the same page (default)

Craft: [visual-craft.md](visual-craft.md) § Ops polish.

## Form page — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent width="narrow"`
3. `MPageHeader` (title + description)
4. `MPageSection variant="form"` → `MForm`
5. `MPageSection variant="actions"` — save (`primary`) + cancel (`secondary`)

## Dashboard — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent density="spacious"` → `MPageHeader` (title + short domain description when useful)
3. KPI row: `MGrid` + `MPageStat` (4 columns or responsive) — real metric names, not “Metric 1”
4. Main split: `MCard shadow="always"` + `MEmpty` (chart pending) and/or recent `MTable` (row status → `MStatus`)

Craft: spacious density + Ops polish; do not turn the first viewport into a marketing hero.

## Composition standards

| Topic | Prefer | Usually avoid |
| --- | --- | --- |
| Shell | `MLayout fillViewport` + `MPageContent` | Padding on `MLayoutContent` |
| Sections | `MPageFilters` / `MPageToolbar` / `MPageSection` | Custom `.page-*`; extra `MCard` wrappers |
| List table | `MTable` in `MPageContent` | Border card solely to wrap the table |
| Spacing | `MSpace` / `MFlex` for peers; page gap from `MPageContent` | Nested padded divs stacking gaps |
| Scroll | Rely on layout scroll; explicit `MScrollbar` for local panes | Forcing overflow on every content slot |
| Color | `--m-*` | Page-level hex / rgb |
| Feedback | One-line → `message`; danger → confirm dialog | Toast for a single short string |
| A11y | Labels + icon `aria-label` | Unlabeled icon controls |

Inline style is acceptable for control widths (e.g. filter `width: 14rem`).

## Detail page — block order

1. Same admin chrome as list (breadcrumb → `MPageContent`)
2. `MPageHeader` — title, `MStatus` in `#actions` (or chip `MTag` for categories), primary/secondary/danger actions
3. Summary `MPageSection` + property `MCard` (definition grid with `--m-*` only)
4. Related data: `MCard` + `MTable` / tabs / timeline
5. Short edit → same-page `MDialog` (`form-in-dialog`); long edit → `form-page` / `MDrawer`

Mirror MCP `get_golden_page` `detail-page`.

## List create/edit dialog — block order

1. Stay on the list page (`MPageHeader` + filters/table; optional batch `MPageToolbar`)
2. `MDialog` ~`28–36rem` + `MForm` fields
3. Actions in Dialog `#footer` (cancel secondary/text + save primary)
4. Success → `message.success` one-liner, then close

Mirror MCP `get_golden_page` `form-in-dialog`.

## Settings page — block order

1. Admin chrome + `MPageContent width="narrow"`
2. `MPageHeader` (title + short description)
3. `MTabs` with **`v-model` + `:tabs`** (not `:items` / `:value`)
4. Per tab: `MPageSection variant="form"` + `MForm` + save in `variant="actions"`
5. Dangerous zone last: `severity="danger"` + confirm

Mirror MCP `get_golden_page` `settings-page`.

## Wizard — block order

1. Narrow `MPageContent` + `MPageHeader`
2. `MStepper v-model` + **`:steps`** (not `:items`)
3. One form/job per step; sticky `上一步` / `下一步` / `创建`
4. Success → `result-page` / `MResult`

Mirror MCP `get_golden_page` `wizard-form`.

## Hybrids

- List + row edit dialog → `form-in-dialog` golden (or list golden + dialog body).
- List + side detail → list + `MDrawer`.
- Resource detail → `detail-page` golden.
- Settings without admin chrome → still use `MPageContent` + `MPageSection`; omit sider only if the host app already provides chrome.
- Non-Ops surfaces (auth, landing, empty, wizard) → [surfaces.md](surfaces.md), not these golden orders.
