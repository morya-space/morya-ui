# Page layouts

When generating a full page, pick a type and follow the **block-order checklist** below. Fill each block with MCP **`get_page_snippet`** / `recommend_page.suggestedSnippets` (composition-first). Optional: `get_golden_page` only to cross-check whole-page order or when the user asks to mirror a golden sample.

Golden pages are **assembly demos / structure baselines**, not the default clone source. Do not add new craft variants (`list-page-*`); density / sider cues inform polish via style direction.

| Type | Checklist below | Optional `get_golden_page` | Typical snippets |
| --- | --- | --- | --- |
| List | List page | `list-page` (`list-page-dense` / `list-page-rail` craft only) | `layout-app-shell`, `page-header-actions`, **`list-filters-stack`** (dense → `list-filters-dense`), `list-table`, `form-in-dialog`, `confirm-delete` |
| Form (long / dedicated) | Form page | `form-page` | `page-content-form`, `form-header`, `form-body`, `form-actions` |
| List create/edit dialog | List create/edit dialog | `form-in-dialog` | **`form-in-dialog`** (preferred) |
| Detail | Detail page | `detail-page` | `detail-toolbar`, `form-in-dialog` |
| Dashboard | Dashboard | `dashboard-page` | `dashboard-kpi-grid`, `dashboard-chart-card`, `dashboard-recent-table` |
| Login | — (see [surfaces.md](surfaces.md)) | `login-page` | **`auth-split-shell`** |
| Landing | — (see [surfaces.md](surfaces.md)) | `landing-page` | — |
| Empty | — | `empty-state` | **`empty-block`** |
| Result / 403 / terminal | — | `result-page` | **`result-block`** |
| Settings | Settings page | `settings-page` | `form-header`, `form-body`, `form-actions` |
| Wizard | Wizard | `wizard-form` | **`wizard-steps`** |

Via MCP: `recommend_page({ style? })` → use **`suggestedSnippets`** + `recommend_component` / `get_page_snippet`; apply `styleDirection` (user reference/description — no preset catalog). Call `get_golden_page` only when needed for block-order check. Style: `get_style_direction`.

**List craft variants** share the same block order; only density / chrome / copy change. Prefer style-direction cues over inventing new golden ids.

## Product defaults

- **Short create/edit** (about ≤8 fields, single section): same-page `MDialog` + `MForm` — snippet `form-in-dialog`; do not invent a new route form for every entity.
- **Long / multi-section / wizard**: dedicated form page (`form-page`) or `MDrawer` (`form-in-drawer`).
- **One-line success/error**: `message` API; title + detail or async notify → `toast` (see [feedback.md](feedback.md)).

## List page — block order

1. `MLayout fillViewport` + optional `MLayoutSider bordered` → snippet `layout-app-shell`
2. Sider `MMenu` (**every item has `icon`**)
3. `MLayoutHeader` → `MBreadcrumb`
4. `MLayoutContent` → `MPageContent` (**add `fill` only when the height rule below applies**) → `page-content-list`
5. `MPageHeader` — page title + `#actions` primary (**one** filled primary in viewport) → `page-header-actions`
6. `MPageFilters` — 默认 **`list-filters-stack`**（collapsible + `#advanced` + `MPageFilterChips`）；条件少无高级区用 `list-filters`；dense craft 用 `list-filters-dense`（plain + small）
7. Optional `MPageFilterChips` — 已含在 `list-filters-stack`；单独增量用 `list-filter-chips`
8. Optional `MPageToolbar` — batch actions only → `list-toolbar` / `list-batch-toolbar`
9. `MTable` directly in content; status → `MStatus`; `#empty` → `MEmpty` → `list-table` + `list-status-dot` + `empty-block`
10. Pagination via `MTable paginator` or sibling `MPagination`
11. Short create/edit → same-page `MDialog` + `MForm` → **`form-in-dialog`**; delete → **`confirm-delete`**

### List height — decide, don’t always fill

Use **`MPageContent fill` + `MTable fill paginator`** only when **most** of these are true:

- The screen is a **full-viewport admin list** (`MLayout fillViewport`) whose **main job** is browsing one data table
- Leaving the table content-sized would leave a large empty band with pagination floating mid-page
- You want **table-body scroll** and pagination pinned to the **bottom of the page**

Skip `fill` when any of these apply:

- Embedded / secondary tables (dashboard “recent”, detail related lists, cards)
- Short or sparse pages where a content-sized table looks fine
- The page should **scroll as a whole document** (long filters + notes + table)
- Tables inside `MDialog` / `MDrawer`
- Mixed layouts where the table is not the sole middle region

Do not invent `min-height` / `calc` hacks when `fill` is the right tool — and do not force `fill` when it isn’t.

Craft: [visual-craft.md](visual-craft.md) § Ops polish.

## Form page — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent width="narrow"` → `page-content-form`
3. `MPageHeader` (title + description) → `form-header`
4. `MPageSection variant="form"` → `MForm` → `form-body`
5. `MPageSection variant="actions"` — save (`primary`) + cancel (`secondary`) → `form-actions`

## Dashboard — block order

1. `MLayout fillViewport` → `MLayoutHeader` → `MBreadcrumb`
2. `MPageContent density="spacious"` → `MPageHeader` (title + short domain description when useful)
3. KPI row: `MGrid` + `MPageStat` (4 columns or responsive) — `dashboard-kpi-grid`
4. Main split: `MCard shadow="always"` + `MEmpty` (chart pending) and/or recent `MTable` — `dashboard-chart-card` / `dashboard-recent-table`

Craft: spacious density + Ops polish; do not turn the first viewport into a marketing hero.

## Composition standards

| Topic | Prefer | Usually avoid |
| --- | --- | --- |
| Shell | `MLayout fillViewport` + `MPageContent` | Padding on `MLayoutContent` |
| Sections | `MPageFilters` / `MPageToolbar` / `MPageSection` | Custom `.page-*`; extra `MCard` wrappers |
| List table | `MTable` in `MPageContent`; add `fill` only when the height rule applies | Border card solely to wrap the table; forcing `fill` on every table |
| Spacing | `MSpace` / `MFlex` for peers; page gap from `MPageContent` | Nested padded divs stacking gaps |
| Scroll | Full-viewport main lists may use table-body scroll via `fill`; otherwise layout / local `MScrollbar` | Forcing overflow on every content slot; stacked page + table scrollbars without reason |
| Color | `--m-*` | Page-level hex / rgb |
| Feedback | One-line → `message`; danger → confirm dialog | Toast for a single short string |
| A11y | Labels + icon `aria-label` | Unlabeled icon controls |

Inline style is acceptable for control widths (e.g. filter `width: 14rem`).

## Detail page — block order

1. Same admin chrome as list (breadcrumb → `MPageContent`)
2. `MPageHeader` — title, `MStatus` in `#actions`, primary/secondary/danger → `detail-toolbar`
3. Summary `MPageSection` + property `MCard` (definition grid with `--m-*` only)
4. Related data: `MCard` + `MTable` / tabs / timeline
5. Short edit → `form-in-dialog`; long edit → form page / `form-in-drawer`

## List create/edit dialog — block order

1. Stay on the list page (`MPageHeader` + filters/table; optional batch `MPageToolbar`)
2. `MDialog` ~`28–36rem` + `MForm` fields → snippet **`form-in-dialog`**
3. Actions in Dialog `#footer` (cancel secondary/text + save primary)
4. Success → `message.success` one-liner, then close

## Settings page — block order

1. Admin chrome + `MPageContent width="narrow"`
2. `MPageHeader` (title + short description)
3. `MTabs` with **`v-model` + `:tabs`** (not `:items` / `:value`)
4. Per tab: `MPageSection variant="form"` + `MForm` + save in `variant="actions"`
5. Dangerous zone last: `severity="danger"` + confirm

## Wizard — block order

1. Narrow `MPageContent` + `MPageHeader`
2. `MStepper v-model` + **`:steps`** (not `:items`) → snippet **`wizard-steps`**
3. One form/job per step; sticky `上一步` / `下一步` / `创建`
4. Success → `result-block` / `MResult`

## Hybrids

- List + row edit dialog → `form-in-dialog` snippet on the list.
- List + side detail → list + `form-in-drawer`.
- Resource detail → detail checklist + `detail-toolbar`.
- Settings without admin chrome → still use `MPageContent` + `MPageSection`; omit sider only if the host app already provides chrome.
- Non-Ops surfaces (auth, landing, empty, wizard) → [surfaces.md](surfaces.md) + matching snippets, not Ops list chrome.
