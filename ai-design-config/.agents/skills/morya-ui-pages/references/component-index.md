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

`MTable`, `MTreeTable`, `MDataView`, `MTree`, `MPagination`, `MTag` / `MChip` / `MBadge`, `MAvatar` / `MAvatarGroup`, `MTimeline`, `MMeterGroup`, `MVirtualScroller`

## Feedback

| API / component | When |
| --- | --- |
| `message` | **Default** one-line CRUD result |
| `toast` | `summary` + `detail`, or async / background feel |
| `<MMessage>` | Persistent in-page error / warning |
| `MProgressBar` / `MProgressSpinner` / `MSkeleton` / `MBlockUI` | Loading / blocking |

## Overlays & menus

`MDialog`, `MDrawer`, `MConfirmDialog` / `MConfirmPopup`, `MPopover`, `MTooltip`, `MDropdown` (**actions only**), `MMenu` / `MMenubar` / `MTieredMenu` / `MMegaMenu`, `MTabs`, `MStepper`, `MCommandMenu`

## Surfaces / media

`MCard`, `MPanel`, `MAccordion`, `MCarousel`, `MGallery`, `MIcon`, `MScrollbar`

## Scenario → pick

| Intent | Prefer |
| --- | --- |
| Searchable list + paging | `MPageFilters` + `MTable` (+ paginator) |
| Create / edit entity page | Form golden layout + `MForm` |
| Create / edit in place | `MDialog` or `MDrawer` + form |
| Delete | `MConfirmDialog` |
| Status chip | `MTag` severities |
| Primary / secondary actions | `MSpace` + `MButton` |
| Dashboard KPIs | `MGrid` + `MPageStat` |
| Org tree | `MTree` / `MTreeSelect` |
| Login / auth | `login-page` golden + `MInputPassword` |
| Marketing landing | `landing-page` golden + `MButton` / `MTag` / `MAccordion` |
| Empty list | `empty-state` golden or `MTable` `#empty` |
| Local capped scroll | Explicit `MScrollbar` |

## Common mistakes

| Wrong | Right |
| --- | --- |
| `MDropdown` as form enum | `MSelect` |
| Hand `<table>` | `MTable` |
| Hand modal div | `MDialog` |
| Extra `MCard` around every `MPage*` block | Use page components' own surface/gap |
| Assume undocumented props | MCP / docs lookup |
