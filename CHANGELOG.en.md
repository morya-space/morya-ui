# morya-ui

## 0.3.2

### Features

- add click ripple and a press-scale toggle
- add link underline toggle
- replace quick jumper with a filterable Select
- refine ops layout primitives and P2 filter/stat APIs
- add shadow prop and remove hoverable

### Fixes

- keep link buttons backgroundless on hover and press
- make plain match outlined hover fill
- make ghost match text hover fill
- Panel component change demo component width
- remove OS reduced-motion media queries from components
- control intensity via library preference only

### Docs

- document impeccable and skills-cli companion install
- document library-only motion control

### Changes

- disable button click ripple by default
- disable button press scale by default
- extract filter and expanded-key helpers
- extract label filter helpers for option lists
- extract sort, filter, and selection helpers
- extract expand and visible-entry helpers
- extract option filter and multi-select helpers
- cover CommandMenu keys and FileUpload dropzone keyboard
- extract accept and size helpers
- polish overlay scale, press feedback, and scroll containment
- refresh snippets, generators, and golden page copies

## 0.3.1

### Features

- replace hand-drawn icons with a generated Tabler registry
- add option groups and header/footer slots
- add triangle icons and update icon rendering logic
- animate pages with a sliding track

### Fixes

- keep the range start thumb above the overlapping track
- keep submenus open on hover and align items with Select
- make the expanded-row loading line visible
- let popup menus grow with their content
- let the menu grow with its content
- close the gap in the sider bar trigger
- compact dropdown filter and keep menu width aligned
- shrink oversized multi-select tags

### Docs

- describe the all-Tabler registry and the generator script
- complete component API tables and instance methods

### Changes

- fix export order and prefer template literals in gallery demos
- resolve newly registered icons directly and drop dead aliases
- replace the custom loading overlay with MLoading
- update header and sort styles for improved layout

## 0.3.0

### Features

- align Select-like overlays and selection UX
- enhance styling and line numbering for code previews
- virtualize Select, Listbox, and AutoComplete menus
- customize gutter via slot, class, and style
- pause looping animations when off-screen
- add collapse height transition
- add global reduced-motion transition fallbacks
- wire transition presets into overlay components
- add global motion config and public exports
- add named enter/exit preset registry
- require validate_usage before page delivery

### Fixes

- scale control affix and layout tokens with density
- default Dialog and ConfirmDialog transition to zoom
- animate Dialog and Drawer panels for shared presets
- keep default presets when transition prop is omitted
- harden reduced-motion tokens and ignore gates
- make style entries and MCP catalog generation idempotent

### Docs

- sync Splitter gutter API in MCP and skills
- add optional Animate.css integration example
- add dedicated motion guide and docs section nav
- document transition presets and playground demo
- document new golden pages and validate_page contracts

### Changes

- sync on-demand style entries and design token catalog
- replace hardcoded sizes with density-aware design tokens
- extract useFloatingViewportSync for overlays
- cut redundant observers and layout work
- drive ProgressBar fill with scaleX
- replace loading aurora blur with soft gradients
- avoid width layout animation on sider chrome
- avoid layout thrash in collapse and float label

## 0.2.9

### Features

- require a craft pass and add Ops polish recipes
- add categorized Tabler built-in icons
- add Loading component

### Fixes

- align Table rows and MMessage host guidance with the real API
- adjust width of selection demo for better layout
- align trailing icon insets with input affixes
- size input affixes from content instead of fixed padding
- add block padding so vertical menus are not flush to edges

### Docs

- sync MCP and setup docs with the current AI tooling
- document optional setup skills and companions
- add Loading docs and demos

### Changes

- simplify sider and content into single-element shells
- refresh Loading circular design tokens

## 0.2.8

### Features

- 新增 Loading 加载组件

### Docs

- 补充 Loading 中英文文档与示例
- update quick start guide for kebab-case imports and dts configuration

### Changes

- stop copying docs into consumer apps
- stop copying design tokens and page examples

## 0.2.7

### Features

- add variant and unify status presentation styles
- redesign Result API and HTTP illustrations
- add illustration catalog and enhance empty states

### Fixes

- Menu RouterLink, Dialog panel width, and Tree indeterminate state

### Docs

- add one-shot setup guide page
- remove other-library comparison wording from docs and comments

### Changes

- rename ai-design-config to design-kit
- sync design tokens for Empty, Result, and Status

## 0.2.6

### Features

- enhance SEO and documentation for Morya UI

### Fixes

- harden Layout fillViewport, Menu links, and ConfigProvider theme

### Docs

- update component count to 90+ in README and related files

## 0.2.5

### Breaking Changes

- rebrand WiseKit to morya-ui with M-prefixed public API
- drop deprecated prop and CSS aliases

### Features

- export Empty, Result, and Status from the library
- add empty state component
- add result page component with locale strings
- add status indicator component
- extract guide page previews into demo SFCs
- extract component previews into shared demo SFCs
- support UnoCSS demos and markdown preview src=
- add new route for components demos page
- theme Tabs, Gallery, Timeline, and Textarea scrolling
- use MScrollbar in data and panel scroll surfaces
- theme popup and flyout scroll with MScrollbar
- use MScrollbar in dialogs, drawers, and popovers
- route layout scroll through MScrollbar
- add ScrollBody and FlyoutSubmenu for themed scrolling
- add page composition tooling for AI agents
- add MPage composition components for admin layouts
- add tooltip support for collapsed menu items
- link API table types to doc anchors
- add hybrid fallthrough attrs helpers
- enhance design token management and documentation
- add reduced motion policy support across components
- integrate WkScrollbar into AutoComplete, CascadeSelect, CommandMenu, and Listbox components
- enhance WkSelect component with scrollbar and max-height functionality
- rebrand to @wex-design/ui and reset release baseline to 0.0.1
- add SSR support for Nuxt, Astro, and Vite
- enhance admin management project with new components and feedback system
- enhance ConfirmDialog and Accordion components
- add design-system guardrails and shared primitives
- add admin management project with initial setup and configuration
- enhance Table component with scrollbar and styling improvements
- implement dynamic icon sizing across components
- enhance resource management and documentation in MCP
- add mobile sidebar drawer for docs and components
- add global site search with CommandMenu
- persist language in URL query
- add dedicated 404 page
- add favicon and meta description
- Harden MCP catalog tooling
- enhance package exports and sideEffects for improved component management
- add extra slot and enhance components in Accordion and AutoComplete
- enhance component defaults and improve configuration management
- add component registry import to index for improved component management
- enhance documentation and component registration for WellInsight
- enhance release process to include MCP build and version sync
- Add MCP server documentation and package reference
- bootstrap standalone @well-insight/ui component library

### Fixes

- disable respect reduced motion for improved layout consistency
- tighten layout typing and demo typecheck
- improve dark semantic contrast and layout rem tokens
- import Scrollbar styles in on-demand component entries
- restore sider content opacity after MScrollbar
- leave Dialog and Drawer scroll to app code
- stop forcing MScrollbar on user-customizable regions
- register Page styles in global stylesheet
- support uncontrolled open and slot trigger
- rename Nuxt module to morya-ui-nuxt for npm publish
- restore wd compat import paths after bulk rename
- fix api with component
- unify suffix icons and Select clearable hover behavior
- restore DatePicker panel grid after teleport
- add invalid modifier class alongside error alias
- improve FloatLabel, Popover, and Slider
- scroll doc TOC inside WiScrollbar
- repair guide links and quick-start copy
- Fix layout header and footer padding axis
- Expose component-specific CSS variables and adjust layout defaults
- Add Configurable Layout Sizing And CSS Tokens
- Improve playground navigation styling
- Standardize Project Linting And Module Exports
- rename Wd to Wi in component library and documentation

### Docs

- note style polish and enable docs reduced-motion
- add AI setup and Agent Skill guides
- recommend npx @morya-ui/setup for one-shot onboarding
- move contributor guide out of the public docs site
- add type sections at end of component docs
- document shared types and type link conventions
- document pt props and trim attrs boilerplate
- add attrs and types guides with updated nav
- describe Vue 3 support with 3.5+ recommendation
- polish docs site home, changelog, and branding
- rebrand as open-source library with logo and README
- complete Events/Slots sections and remove migration guide
- add Events and a11y sections to high-traffic components
- rename Basic sections to 基础用法 in Chinese component docs
- add accessibility guide for playground
- expand menu and virtual scroller component pages
- add deprecated API migration guide
- Add UI MCP server and docs site links
- Update install docs to omit explicit Vue dependency

### Changes

- polish component styles and shared base motion
- refresh docs site visual polish
- remove redundant package declaration and update peer dependency rules
- regenerate design tokens for scrollbar-related CSS vars
- import additional styles for Card and Icon components
- improve submenu arrow icon and expand behavior
- update dataset keys from 'mu' to 'm' for consistency
- add component doc type section tooling
- add attrs audit and doc maintenance tooling
- apply hybrid attrs routing across library
- update documentation links to reflect new GitHub Pages URL
- rename satellite packages to @morya-ui scope
- migrate to Wk tokens and remove legacy compat layers
- rebrand to @wise-kit/ui and reset release baseline to 0.1.1
- update @roost-design/ui version in pnpm-lock.yaml and enhance SiteHeader component
- rebrand library to @roost-design/ui and reset version to 0.1.1
- update catalog generation timestamp and adjust component exports
- rebrand library from @wex-design/ui to @roost-design/ui
- reset release baseline to 0.1.1 with fresh changelog
- update Vue peer dependency and documentation references
- deploy docs site to GitHub Pages
- remove admin-manage-project from monorepo
- update check-docs-drift script and package.json
- update CHANGELOG for version 0.1.14
- update Table component to use columns and rows structure
- update Table component structure and improve functionality
- import Icon styles across multiple components
- enhance MobileSidebarShell and DocsView layout with improved flex properties
- unify clearable API across pickers (phase 6b)
- phase 6a icon unification and shared picker suffix
- split vendor chunks and replace eager markdown manifest
- add unit tests for 16 sub-components
- migrate remaining overlays to shared placement util
- add shared menu icon and key utilities
- replace hardcoded colors with design tokens
- migrate Select and Dropdown to shared overlay placement
- extract shared overlay placement utility
- lazy-load routes and markdown docs
- streamline MCP tools from 18 to 13
- Simplify layout components by removing custom scrollbar support and enhancing layout styles
- clean up whitespace in base.css for consistency
- Simplify package.json exports by removing development paths for styles and index files
- restructure release process and update documentation

## Unreleased

### Fixes

- Use `--m-z-dropdown` for teleported Dropdown / SplitButton menus (aligned with Select / Menu)
- Add local z-index on ProgressSpinner wrap overlay so dense content cannot paint over it
- Darken dark-theme solid semantic colors so they keep contrast with `--m-color-on-emphasis`
- Add reduced-motion guards for Button / Badge / shared enter transitions / Dialog / Drawer / Popover / Message / BlockUI
- Layout default sizes use rem tokens; ScrollRegion style types align with Scrollbar
- Docs site respects reduced motion; fix guide manifest unit test

### Changes

- Library-wide component style polish (Batches 0–6): states, tokens, feedback stacking, layout details
- Explicit return types on Message / Toast `findDuplicate*` helpers

## 0.2.4

### Features

- add new route for components demos page
- theme Tabs, Gallery, Timeline, and Textarea scrolling
- use MScrollbar in data and panel scroll surfaces
- theme popup and flyout scroll with MScrollbar
- use MScrollbar in dialogs, drawers, and popovers
- route layout scroll through MScrollbar
- add ScrollBody and FlyoutSubmenu for themed scrolling

### Fixes

- leave Dialog and Drawer scroll to app code
- stop forcing MScrollbar on user-customizable regions

### Changes

- regenerate design tokens for scrollbar-related CSS vars
- import additional styles for Card and Icon components

## 0.2.3

### Features

- add page composition tooling for AI agents
- add MPage composition components for admin layouts

### Fixes

- register Page styles in global stylesheet

## 0.2.2

### Features

- add tooltip support for collapsed menu items

### Changes

- improve submenu arrow icon and expand behavior
- update dataset keys from 'mu' to 'm' for consistency

## 0.2.1

### Breaking Changes

- rebrand WiseKit to morya-ui with M-prefixed public API

### Features

- link API table types to doc anchors
- add hybrid fallthrough attrs helpers

### Fixes

- support uncontrolled open and slot trigger
- rename Nuxt module to morya-ui-nuxt for npm publish

### Docs

- add type sections at end of component docs
- document shared types and type link conventions
- document pt props and trim attrs boilerplate
- add attrs and types guides with updated nav

### Changes

- add component doc type section tooling
- add attrs audit and doc maintenance tooling
- apply hybrid attrs routing across library
- update documentation links to reflect new GitHub Pages URL
- rename satellite packages to @morya-ui scope

## 0.1.1

Initial public release of `morya-ui` (Morya UI), using the current component library as the baseline.

### Components (88)

- **Basics**: Button, ButtonGroup, Icon, Avatar, AvatarGroup, Badge, Chip, Tag, Divider, Skeleton, ProgressBar, ProgressSpinner, BlockUI, ScrollTop
- **Forms**: Input, Textarea, InputNumber, InputPassword, InputOtp, InputTags, InputColor, InputGroup, InputGroupAddon, IconField, FloatLabel, Label, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Select, SelectButton, ToggleButton, Slider, Knob, Rating, DatePicker, AutoComplete, CascadeSelect, TreeSelect, FileUpload, Form, FormItem
- **Overlays & dialogs**: Dialog, Drawer, Popover, Tooltip, ConfirmDialog, ConfirmPopup, ContextMenu, Dropdown, SplitButton, SpeedDial
- **Data display**: Table, Tree, TreeTable, TreeSelect, DataView, VirtualScroller, Timeline, MeterGroup, Terminal, Gallery, Carousel, Inplace
- **Navigation & menus**: Menu, Menubar, MegaMenu, TieredMenu, Breadcrumb, Tabs, Stepper, Pagination, CommandMenu, Dock, Sidebar
- **Layout**: Layout (Header / Sider / Content / Footer), Grid, Flex, Space, Fluid, Panel, Card, Fieldset, Accordion, Splitter, Toolbar, Listbox, PickList, OrderList, Scrollbar

### Theme & design tokens

- Light / dark themes (`useTheme`, `applyTheme`, `getPreferredTheme`)
- Density and motion preferences (`useDensity`, `useMotion`, with `prefers-reduced-motion` and `data-m-motion`)
- Token system on `--m-*` CSS variables (color, spacing, radius, shadow, border, layout, tree, timeline, splitter, and more)
- Subtree overrides via `MConfigProvider` (theme, density, motion, component defaults)

### Global config & utilities

- Plugin entry: full registration with `MoryaUI`, defaults with `createMoryaUI`
- On-demand builds: `MoryaUIResolver` for `unplugin-vue-components`
- ESM subpath exports (`morya-ui/button`, etc.) with tree-shaking
- Imperative APIs: `useConfirm`, `useToast` / `toast`, `useMessage` / `message`, `useContextMenu`
- Shared composables: `useControllable`, `useFieldFeedback`, `useMenuKeyboard`, `useModalOverlay`, `useMId`
- i18n: `zhCN`, `enUS`, `mergeLocale`, `useMLocale`, `formatLocale`

### Build output & types

- ESM + type declarations + bundled `styles.css`
- Full TypeScript coverage for props, emits, slots, and locale messages
- `sideEffects` and granular exports for per-component style imports

### Documentation site

- Interactive docs with Markdown and live `vue preview` examples
- Component catalog and guides (quick start, theme, config, SSR, accessibility, MCP)
- Light / dark theme, bilingual UI, global search (CommandMenu)
- Deployed to GitHub Pages: https://morya-space.github.io/morya-ui/

### Ecosystem packages

- **`@morya-ui/nuxt`**: Nuxt 3 module (styles, transpile, client overlay context)
- **`@morya-ui/mcp`**: MCP server for AI clients to query component docs, examples, and usage guidance

### SSR & framework integration

- Works with Nuxt 3, Astro + Vue, Vite SSR, and similar setups (Vue 3.5+ recommended)
- Unified overlay mounting and placement (flip / clamp) strategy

### Accessibility

- ARIA and keyboard support on core paths (forms, Tabs, Slider, Switch, MeterGroup, ProgressSpinner, etc.)
- Unified menu keyboard navigation (`useMenuKeyboard`)
- Tree / TreeTable treegrid semantics

### Quality

- 600+ unit tests
- Design token checks via `check:tokens` and `check:colors`
