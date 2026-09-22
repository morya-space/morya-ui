# Component index (scenario map)

Full API: docs site `/components` or MCP (`get_component`, `search`, `validate_usage`). This file is for **selection**, not prop manuals.

## Shell

| Component | Use |
| --- | --- |
| `MConfigProvider` | Root locale / theme / density / defaults |
| `MLayout` family | Admin chrome (`MLayoutSider` is the layout sider) |
| `MSidebar` | Standalone nav rail (not a `MDrawer`, not a substitute for `MLayoutSider` inside `MLayout`) |
| `MBreadcrumb` | Path |
| `MPageContent` / `MPageFilters` / `MPageToolbar` / `MPageHeader` / `MPageSection` / `MPageStat` / `MPagePlaceholder` | Page composition |
| `MDock` | App dock / launcher, not page actions |

## Actions

`MButton` / `MButtonGroup` (primary `severity="primary"`, danger `severity="danger"`), `MSplitButton` (main action + menu), `MSpeedDial` (floating action cluster)

## Forms · inputs

`MForm`, `MFormItem`, `MInput`, `MInputPassword`, `MInputNumber`, `MTextarea`, `MInputOtp`, `MInputColor`, `MInputGroup`, `MInputTags`, `MSelect`, `MTreeSelect`, `MCascadeSelect`, `MListbox`, `MSelectButton`, `MDatePicker`, `MAutoComplete`, `MCheckbox` / `MCheckboxGroup`, `MRadio` / `MRadioGroup`, `MSwitch`, `MToggleButton`, `MSlider`, `MRating`, `MKnob`, `MFileUpload`, `MFloatLabel`, `MIconField`, `MLabel`

## Layout helpers

`MGrid` / `MGridItem`, `MFlex`, `MSpace`, `MFluid`, `MDivider`, `MFieldset`, `MSplitter`, `MToolbar`

## Data

`MTable` (`columns` + **`rows`**, not `data`), `MTreeTable`, `MDataView`, `MTree`, `MPagination`, `MOrderList`, `MPickList`, `MStatus` / `MTag` / `MChip` / `MBadge`, `MAvatar` / `MAvatarGroup`, `MTimeline`, `MMeterGroup`, `MVirtualScroller`

## Feedback

| API / component | When |
| --- | --- |
| `message` | **Default** one-line CRUD result |
| `toast` | `summary` + `detail`, or async / background feel |
| `<MMessage>` | Optional host for the `message` service (`appendTo` / placement). **Not** an inline alert |
| field `errorMessage` or token `role="alert"` | Persistent form / auth error |
| `MEmpty` | No-data / first-use / filtered empty (not an error) |
| `MResult` | Terminal outcome: success, failure, 403 / 404 / 500 |
| `MLoading` / `v-loading` / `loading.service` | **Default** region or fullscreen loading mask |
| `MSkeleton` | Layout is already known; placeholder while content arrives |
| `MProgressBar` | Determinate progress |
| `MProgressSpinner` | Inline spinner only, not a region mask |
| `MBlockUI` | Block interaction without a loading message |

## Overlays & menus

`MDialog`, `MDrawer`, `MConfirmDialog` / `MConfirmPopup`, `MPopover`, `MTooltip`, `MDropdown` (**actions only**), `MContextMenu` (right-click), `MCommandMenu` (searchable command palette), `MMenu` / `MMenubar` / `MTieredMenu` / `MMegaMenu`, `MTabs`, `MStepper`

## Surfaces / media

`MCard`, `MPanel`, `MAccordion`, `MCarousel`, `MGallery`, `MIcon`, `MScrollbar`, `MInplace`, `MScrollTop`, `MTerminal`

## Scenario → pick

| Intent | Prefer |
| --- | --- |
| Searchable list + paging | `MPageFilters` + `MTable` (+ paginator) |
| Create / edit from a list (few–medium fields) | **`form-in-dialog`** golden (`MDialog` + `MForm`) |
| Create / edit long / multi-section entity | Form golden page **or** `MDrawer` |
| Resource detail / profile | `detail-page` golden |
| Delete | `MConfirmDialog` |
| Lightweight inline status | `MStatus` (dot + label) |
| Status chip / closable label | `MTag` severities |
| Primary / secondary actions | `MSpace` + `MButton` |
| Dashboard KPIs | `MGrid` + `MPageStat` |
| Org tree | `MTree` / `MTreeSelect` |
| Login / auth | `login-page` golden + `MInputPassword` |
| Marketing landing | `landing-page` golden + `MButton` / `MTag` / `MAccordion` |
| Empty list / zero state | `MEmpty` (+ `empty-state` golden or `MTable` `#empty`) |
| Preferences / settings | `settings-page` golden (`MTabs` + `tabs`) |
| Multi-step create | `wizard-form` golden (`MStepper` + `steps`) |
| Region or page is waiting | `MLoading`, `v-loading`, or `loading.service`; known layout → `MSkeleton` |
| Local capped scroll | Explicit `MScrollbar` |
| Resizable two-pane (editor / preview, master-detail) | `MSplitter` |
| Admin sider nav | `MMenu` inside `MLayoutSider` (or `MSidebar` when the shell is not `MLayout`) |
| Few options, all visible | `MRadio` or `MSelectButton` |
| Always-visible option list | `MListbox` |
| Multi-level cascade (not a tree dropdown) | `MCascadeSelect` |
| Right-click actions | `MContextMenu` |
| Global command search | `MCommandMenu` |
| Count or dot on a control | `MBadge` |
| Removable entity chip | `MChip` |

## Common mistakes

| Wrong | Right |
| --- | --- |
| `MDropdown` as form enum | `MSelect` |
| `MTable` `:data` | `:rows` (`row-key` defaults to `id`) |
| `<MMessage severity>` as an inline alert | Field `errorMessage`, or a token-styled `role="alert"` |
| Hand `<table>` | `MTable` |
| Hand modal div | `MDialog` |
| Hand spinner or `MProgressSpinner` as a region / page mask | `MLoading` / `v-loading` |
| Extra `MCard` around every `MPage*` block | Use page components' own surface/gap |
| Assume undocumented props | MCP / docs lookup |
