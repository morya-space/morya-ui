# Page layouts

When generating a full page, pick a type and **mirror the golden-page block order**. Prefer project files when present:

| Type | Golden page | Runnable example |
| --- | --- | --- |
| List | `docs/golden-pages/list-page.vue` | `src/examples/ListPageExample.vue` |
| Form | `docs/golden-pages/form-page.vue` | `src/examples/FormPageExample.vue` |
| Dashboard | `docs/golden-pages/dashboard-page.vue` | `src/examples/DashboardPageExample.vue` |
| Login | `docs/golden-pages/login-page.vue` | `src/examples/LoginPageExample.vue` |
| Landing | `docs/golden-pages/landing-page.vue` | `src/examples/LandingPageExample.vue` |
| Empty | `docs/golden-pages/empty-state.vue` | `src/examples/EmptyStateExample.vue` |

Via MCP: `recommend_page` → `get_golden_page`; local edits: `get_page_snippet` (`filters`, `toolbar`, `form-actions`, `scrollable-panel`, …).

## List page — block order

1. `MLayout fillViewport` + optional `MLayoutSider bordered`
2. `MLayoutHeader` → `MBreadcrumb`
3. `MLayoutContent` → `MPageContent`
4. `MPageFilters` — inner `MSpace` + Input/Select + query/reset
5. `MPageToolbar` — title + `#actions` primary action
6. `MTable` directly in content (usually **no** wrapping `MCard`)
7. Pagination via `MTable` paginator or sibling `MPagination`

## Form page — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent width="narrow"`
3. `MPageHeader` (title + description)
4. `MPageSection variant="form"` → `MForm`
5. `MPageSection variant="actions"` — save (`primary`) + cancel (`secondary`)

## Dashboard — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent density="spacious"` → `MPageHeader`
3. KPI row: `MGrid` + `MPageStat` (4 columns or responsive)
4. Main split: `MCard` + `MPagePlaceholder` and/or recent `MTable`

## Composition standards

| Topic | Prefer | Usually avoid |
| --- | --- | --- |
| Shell | `MLayout fillViewport` + `MPageContent` | Hand `min-height: 100vh`; padding on `MLayoutContent` |
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
2. `MPageHeader` — title, status `MTag`, primary/secondary actions
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
