# Component index (scenario map)

Full API: docs site `/components` or MCP (`get_component`, `search`, `validate_usage`). This file is for **selection**, not prop manuals.

## Shell

| Component | Use |
| --- | --- |
| `MConfigProvider` | Root locale / theme / density / defaults |
| `MLayout` family | Admin chrome |
| `MBreadcrumb` | Path |
| `MPageContent` / `MPageFilters` / `MPageToolbar` / `MPageHeader` / `MPageSection` / `MPageStat` / `MPagePlaceholder` | Page composition |

## Forms · inputs

`MForm`, `MFormItem`, `MInput`, `MInputPassword`, `MInputNumber`, `MTextarea`, `MSelect`, `MTreeSelect`, `MCascadeSelect`, `MDatePicker`, `MAutoComplete`, `MCheckbox` / `MCheckboxGroup`, `MRadio` / `MRadioGroup`, `MSwitch`, `MSlider`, `MRating`, `MInputTags`, `MFileUpload`, `MFloatLabel`, `MIconField`

## Layout helpers

`MGrid` / `MGridItem`, `MFlex`, `MSpace`, `MFluid`, `MDivider`, `MFieldset`

## Data

`MTable`, `MTreeTable`, `MDataView`, `MTree`, `MPagination`, `MStatus` / `MTag` / `MChip` / `MBadge`, `MAvatar` / `MAvatarGroup`, `MTimeline`, `MMeterGroup`, `MVirtualScroller`

## Feedback

| API / component | When |
| --- | --- |
| `message` | **Default** one-line CRUD result |
| `toast` | `summary` + `detail`, or async / background feel |
| `<MMessage>` | Persistent in-page error / warning |
| `MEmpty` | No-data / first-use / filtered empty (not an error) |
| `MResult` | Terminal outcome: success, failure, 403 / 404 / 500 |
| `MLoading` / `v-loading` / `loading.service` | **Default** region or fullscreen loading mask |
| `MSkeleton` | Layout is already known; placeholder while content arrives |
| `MProgressBar` | Determinate progress |
| `MProgressSpinner` | Inline spinner only, not a region mask |
| `MBlockUI` | Block interaction without a loading message |

## Overlays & menus

`MDialog`, `MDrawer`, `MConfirmDialog` / `MConfirmPopup`, `MPopover`, `MTooltip`, `MDropdown` (**actions only**), `MMenu` / `MMenubar` / `MTieredMenu` / `MMegaMenu`, `MTabs`, `MStepper`, `MCommandMenu`

## Surfaces / media

`MCard`, `MPanel`, `MAccordion`, `MCarousel`, `MGallery`, `MIcon`, `MScrollbar`

## Scenario → pick

| Intent | Prefer |
| --- | --- |
| Searchable list + paging | `MPageFilters` + `MTable` (+ paginator) |
| Create / edit from a list (few–medium fields) | **`MDialog` + `MForm`** (stay on the list) |
| Create / edit long / multi-section entity | Form golden page **or** `MDrawer` |
| Delete | `MConfirmDialog` |
| Lightweight inline status | `MStatus` (dot + label) |
| Status chip / closable label | `MTag` severities |
| Primary / secondary actions | `MSpace` + `MButton` |
| Dashboard KPIs | `MGrid` + `MPageStat` |
| Org tree | `MTree` / `MTreeSelect` |
| Login / auth | `login-page` golden + `MInputPassword` |
| Marketing landing | `landing-page` golden + `MButton` / `MTag` / `MAccordion` |
| Empty list / zero state | `MEmpty` (+ `empty-state` golden or `MTable` `#empty`) |
| Submit success / HTTP error page | `MResult` |
| Region or page is waiting | `MLoading`, `v-loading`, or `loading.service`; known layout → `MSkeleton` |
| Local capped scroll | Explicit `MScrollbar` |
| Admin sider nav | `MMenu` |

## Common mistakes

| Wrong | Right |
| --- | --- |
| `MDropdown` as form enum | `MSelect` |
| Hand `<table>` | `MTable` |
| Hand modal div | `MDialog` |
| Hand spinner or `MProgressSpinner` as a region / page mask | `MLoading` / `v-loading` |
| Extra `MCard` around every `MPage*` block | Use page components' own surface/gap |
| Assume undocumented props | MCP / docs lookup |
