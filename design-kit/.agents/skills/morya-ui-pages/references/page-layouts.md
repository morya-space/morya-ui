# Page layouts

When generating a full page, pick a type and **mirror the golden-page block order**. Source: MCP `get_golden_page`.

| Type | `get_golden_page` id |
| --- | --- |
| List | `list-page` |
| Form | `form-page` |
| Dashboard | `dashboard-page` |
| Login | `login-page` |
| Landing | `landing-page` |
| Empty | `empty-state` |

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
5. `MPageFilters` — inner `MSpace wrap` + Input/Select + query/reset (search ~`14rem`, select ~`10–12rem`)
6. `MPageToolbar` — title + `#actions` primary action (**one** filled primary)
7. `MTable` directly in content (usually **no** wrapping `MCard`); status → `MStatus`; `#empty` → `MEmpty`
8. Pagination via `MTable` paginator or sibling `MPagination`
9. Short create/edit → `MDialog` + `MForm` on the same page (default)

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
4. Main split: `MCard` + `MPagePlaceholder` and/or recent `MTable` (row status → `MStatus`)

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

## Detail page — suggested order

1. Same admin chrome as list (breadcrumb → `MPageContent`)
2. `MPageHeader` — title, status via `MStatus` (light) or `MTag` (chip), primary/secondary actions
3. Summary `MCard` or definition sections via `MPageSection`
4. Related data: nested `MTabs` + `MTable` / timeline
5. Edit via route, or `MDrawer` / `MDialog` — do not turn detail into a marketing page

## Settings page — suggested order

1. Admin chrome + `MPageContent width="narrow"` (or split: side `MMenu`/`MTabs` + content)
2. Grouped `MPageSection` or `MTabs` by concern (资料 / 通知 / 安全)
3. Each group: `MForm` + save actions (section-level or page-level — be consistent)
4. Dangerous zone last: `severity="danger"` + confirm

## Hybrids

- List + row edit dialog → list golden page + `MDialog` form body.
- List + side detail → list + `MDrawer`.
- Settings without admin chrome → still use `MPageContent` + `MPageSection`; omit sider only if the host app already provides chrome.
- Non-Ops surfaces (auth, landing, empty, wizard) → [surfaces.md](surfaces.md), not these golden orders.
