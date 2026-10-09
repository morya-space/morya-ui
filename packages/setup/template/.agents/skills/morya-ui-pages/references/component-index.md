# Component index (scenario map)

Full API: docs site `/components` or MCP (`get_component`, `search`, `validate_usage`).

- **Selection + key props**: MCP `recommend_component`, or offline [decision-recipes.md](./decision-recipes.md) (generated from `packages/ui-mcp/src/decisions.ts`).
- This file is a **catalog + decision-id index**, not a prop manual.

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

`MButton` / `MButtonGroup` (primary `type="primary"`, danger `danger` / `color="danger"`; counts via wrapping `MBadge`, not Button props), `MSplitButton` (main action + menu), `MSpeedDial` (floating action cluster)

## Forms · inputs

`MForm` / `MFormItem` / `MFormList`, `MInput`, `MInputPassword`, `MInputNumber`, `MTextarea`, `MInputOtp`, `MInputColor`, `MInputGroup`, `MInputTags`, `MMentions`, `MSelect`, `MTreeSelect`, `MCascadeSelect`, `MListbox`, `MSelectButton`, `MDatePicker`, `MTimePicker`, `MCalendar`, `MAutoComplete`, `MCheckbox` / `MCheckboxGroup`, `MRadio` / `MRadioGroup`, `MSwitch`, `MToggleButton`, `MSlider`, `MRating`, `MKnob`, `MFileUpload`, `MFloatLabel`, `MIconField`, `MLabel`

## Layout helpers

`MGrid` / `MGridItem`, `MFlex`, `MSpace`, `MFluid`, `MDivider`, `MFieldset`, `MSplitter`, `MToolbar`

## Data

`MTable` (`columns` + **`rows`**, not `data`; optional `virtual`, `resizable`/`filterable`, `children`, `span-method`, `tree-config`), `MDataView`, `MList` / `MListItem` / `MListItemMeta`, `MTree`, `MPagination`, `MOrderList`, `MPickList`, `MDescriptions`, `MStatistic`, `MStatus` / `MTag` / `MChip` / `MBadge`, `MAvatar` / `MAvatarGroup`, `MTimeline`, `MMeterGroup`, `MVirtualScroller`

## Feedback

| API / component | When | Decision |
| --- | --- | --- |
| `message` | **Default** one-line CRUD result | `feedback-choice` |
| `toast` | `summary` + `detail`, or async / background feel | `feedback-choice` |
| `<MMessage>` | Optional host for the `message` service. **Not** an inline alert | `feedback-choice` |
| field `errorMessage` or token `role="alert"` | Persistent form / auth error | `feedback-choice` |
| `MAlert` | Persistent in-page notice (not a toast) | `feedback-choice` |
| `MEmpty` | No-data / first-use / filtered empty | `empty-result-choice` |
| `MResult` | Terminal outcome: success, failure, 403 / 404 / 500 | `empty-result-choice` |
| `MLoading` / `v-loading` / `loading.service` | **Default** region or fullscreen loading mask | `loading-choice` |
| `MSkeleton` | Layout known; placeholder while content arrives | `loading-choice` |
| `MProgressBar` | Determinate progress | `loading-choice` |
| `MProgressSpinner` | Inline spinner only, not a region mask | `loading-choice` |
| `MBlockUI` | Block interaction without a loading message | `loading-choice` |

## Overlays & menus

`MDialog`, `MDrawer`, `MConfirmDialog` / `MConfirmPopup`, `MPopover`, `MTooltip`, `MDropdown` (**actions only**), `MContextMenu`, `MCommandMenu`, `MMenu` / `MMenubar` / `MTieredMenu` / `MMegaMenu`, `MTabs`, `MStepper`, `MTour`, `MAffix`, `MAnchor`

## Surfaces / media

`MCard`, `MPanel`, `MAccordion`, `MCarousel`, `MGallery`, `MImage`, `MIcon`, `MQRCode`, `MScrollbar`, `MInplace`, `MScrollTop`, `MTerminal`, `MTypography` / `MTitle` / `MText` / `MParagraph` / `MLink`, `MWatermark`

## Scenario → decision

Open MCP `recommend_component({ decision })` or the matching section in [decision-recipes.md](./decision-recipes.md) for **when / avoid / recipe props / anti-patterns**.

| Intent | Decision id |
| --- | --- |
| Create / edit from a list (few–medium fields) vs long form page | `form-surface-choice` |
| Dialog vs Drawer vs Popover vs Tooltip | `overlay-choice` |
| Table vs DataView vs Tree（树表用 Table `tree-config`） | `data-display-choice` |
| Select vs TreeSelect vs AutoComplete vs Radio / … | `selection-choice` |
| Card vs Panel vs Fieldset | `surface-choice` |
| PageContent vs Flex vs Space vs Grid | `layout-spacing-choice` |
| PageFilters / Toolbar / Header / Section / Stat / Placeholder | `page-section-choice` |
| Layout scroll vs MScrollbar vs built-in | `page-scroll-choice` |
| Avoid double borders / extra Card wrappers | `surface-nesting-choice` |
| Loading vs Skeleton vs Progress* vs BlockUI | `loading-choice` |
| Status vs Tag vs Chip vs Badge | `status-label-choice` |
| Empty vs Result | `empty-result-choice` |
| Dropdown vs Menu vs ContextMenu vs CommandMenu | `action-menu-choice` |
| message vs toast vs field / form alert | `feedback-choice` |
| ConfirmDialog vs ConfirmPopup | `confirm-choice` |
| Searchable list + paging | `page-section-choice` + `data-display-choice` (+ list golden) |
| Delete / destructive | `confirm-choice` |
| Login / auth | `feedback-choice` + `login-page` golden |
| Marketing landing | `landing-page` golden (Express) |
| Multi-step create | `wizard-form` golden |
| Preferences / settings | `settings-page` golden |
| Resizable two-pane | use `MSplitter` (see docs / `get_component`) |

## Common mistakes

| Wrong | Right |
| --- | --- |
| `MDropdown` as form enum | `MSelect` (`selection-choice`) |
| `MTable` `:data` | `:rows` (`data-display-choice`) |
| `<MMessage type>` (or legacy `severity`) as an inline alert | Field `errorMessage`, or token `role="alert"` (`feedback-choice`) |
| `MButton severity="…"` / treating Button sugar `type` as status tone | `type="primary"` for look; status via `MStatus` / `MTag type="…"`; danger via `danger` / `color="danger"` |
| `MButton badge` / `badgeColor` | Wrap with `MBadge` (`status-label-choice`) |
| Hand `<table>` | `MTable` |
| Hand modal div | `MDialog` / `MConfirmDialog` |
| Hand spinner or `MProgressSpinner` as a region / page mask | `MLoading` / `v-loading` (`loading-choice`) |
| Extra `MCard` around every `MPage*` block | `surface-nesting-choice` |
| Assume undocumented props | MCP / docs lookup + `validate_usage` |
