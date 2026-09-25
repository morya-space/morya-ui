# morya-ui

## 0.3.5

### 新功能

- upgrade morya-ui and @morya-ui packages to latest on run
- add trailing actions slot and advanced toggle chrome

## 0.3.4

### 新功能

- add conditional fill height for admin list pages
- enhance size prop to accept CSS length strings and update documentation

## 0.3.3

### 新功能

- add L2 decision recipes for component selection
- support disabling the link underline

### 修复

- dismiss overlay on page scroll or resize
- align overlay motion with scale-fade
- correct link, plain, and ghost variant styles
- disable ripple and press by default
- correct import paths for styles in Card, Icon, Page, and Pagination components

### 文档

- wire morya-ui-pages to decision recipes

### 变更

- align menu item chrome with Select and Dropdown
- add full Button prop demos

## 0.3.2

### 新功能

- add click ripple and a press-scale toggle
- add link underline toggle
- replace quick jumper with a filterable Select
- refine ops layout primitives and P2 filter/stat APIs
- add shadow prop and remove hoverable

### 修复

- keep link buttons backgroundless on hover and press
- make plain match outlined hover fill
- make ghost match text hover fill
- Panel component change demo component width
- remove OS reduced-motion media queries from components
- control intensity via library preference only

### 文档

- document impeccable and skills-cli companion install
- document library-only motion control

### 变更

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

### 新功能

- replace hand-drawn icons with a generated Tabler registry
- add option groups and header/footer slots
- add triangle icons and update icon rendering logic
- animate pages with a sliding track

### 修复

- keep the range start thumb above the overlapping track
- keep submenus open on hover and align items with Select
- make the expanded-row loading line visible
- let popup menus grow with their content
- let the menu grow with its content
- close the gap in the sider bar trigger
- compact dropdown filter and keep menu width aligned
- shrink oversized multi-select tags

### 文档

- describe the all-Tabler registry and the generator script
- complete component API tables and instance methods

### 变更

- fix export order and prefer template literals in gallery demos
- resolve newly registered icons directly and drop dead aliases
- replace the custom loading overlay with MLoading
- update header and sort styles for improved layout

## 0.3.0

### 新功能

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

### 修复

- scale control affix and layout tokens with density
- default Dialog and ConfirmDialog transition to zoom
- animate Dialog and Drawer panels for shared presets
- keep default presets when transition prop is omitted
- harden reduced-motion tokens and ignore gates
- make style entries and MCP catalog generation idempotent

### 文档

- sync Splitter gutter API in MCP and skills
- add optional Animate.css integration example
- add dedicated motion guide and docs section nav
- document transition presets and playground demo
- document new golden pages and validate_page contracts

### 变更

- sync on-demand style entries and design token catalog
- replace hardcoded sizes with density-aware design tokens
- extract useFloatingViewportSync for overlays
- cut redundant observers and layout work
- drive ProgressBar fill with scaleX
- replace loading aurora blur with soft gradients
- avoid width layout animation on sider chrome
- avoid layout thrash in collapse and float label

## 0.2.9

### 新功能

- require a craft pass and add Ops polish recipes
- add categorized Tabler built-in icons
- add Loading component

### 修复

- align Table rows and MMessage host guidance with the real API
- adjust width of selection demo for better layout
- align trailing icon insets with input affixes
- size input affixes from content instead of fixed padding
- add block padding so vertical menus are not flush to edges

### 文档

- sync MCP and setup docs with the current AI tooling
- document optional setup skills and companions
- add Loading docs and demos

### 变更

- simplify sider and content into single-element shells
- refresh Loading circular design tokens

## 0.2.8

### 新功能

- 新增 Loading 加载组件

### 文档

- 补充 Loading 中英文文档与示例
- update quick start guide for kebab-case imports and dts configuration

### 变更

- stop copying docs into consumer apps
- stop copying design tokens and page examples

## 0.2.7

### 新功能

- add variant and unify status presentation styles
- redesign Result API and HTTP illustrations
- add illustration catalog and enhance empty states

### 修复

- Menu RouterLink, Dialog panel width, and Tree indeterminate state

### 文档

- add one-shot setup guide page
- remove other-library comparison wording from docs and comments

### 变更

- rename ai-design-config to design-kit
- sync design tokens for Empty, Result, and Status

## 0.2.6

### 新功能

- enhance SEO and documentation for Morya UI

### 修复

- harden Layout fillViewport, Menu links, and ConfigProvider theme

### 文档

- update component count to 90+ in README and related files

## 0.2.5

### 破坏性变更

- rebrand WiseKit to morya-ui with M-prefixed public API
- drop deprecated prop and CSS aliases

### 新功能

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

### 修复

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

### 文档

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

### 变更

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

### 修复

- Dropdown / SplitButton 传送菜单层级改为 `--m-z-dropdown`（与 Select / Menu 一致）
- ProgressSpinner wrap 遮罩补局部 z-index，避免被内容盖住
- 暗色主题语义实心色（success / danger 等）加深，保证与 `--m-color-on-emphasis` 对比可读
- Button / Badge / 共享进出场 / Dialog / Drawer / Popover / Message / BlockUI 补齐 reduced-motion
- Layout 默认宽高改为 rem token；ScrollRegion 样式类型与 Scrollbar 对齐
- 文档站开启 `respect-reduced-motion`；修复 guide manifest 单测

### 变更

- 全库组件样式 polish（Batch 0–6）：状态、token、反馈层级与布局细节
- Message / Toast `findDuplicate*` 补充显式返回类型

## 0.2.4

### 新功能

- add new route for components demos page
- theme Tabs, Gallery, Timeline, and Textarea scrolling
- use MScrollbar in data and panel scroll surfaces
- theme popup and flyout scroll with MScrollbar
- use MScrollbar in dialogs, drawers, and popovers
- route layout scroll through MScrollbar
- add ScrollBody and FlyoutSubmenu for themed scrolling

### 修复

- leave Dialog and Drawer scroll to app code
- stop forcing MScrollbar on user-customizable regions

### 变更

- regenerate design tokens for scrollbar-related CSS vars
- import additional styles for Card and Icon components

## 0.2.3

### 新功能

- add page composition tooling for AI agents
- add MPage composition components for admin layouts

### 修复

- register Page styles in global stylesheet

## 0.2.2

### 新功能

- add tooltip support for collapsed menu items

### 变更

- improve submenu arrow icon and expand behavior
- update dataset keys from 'mu' to 'm' for consistency

## 0.2.1

### 破坏性变更

- rebrand WiseKit to morya-ui with M-prefixed public API

### 新功能

- link API table types to doc anchors
- add hybrid fallthrough attrs helpers

### 修复

- support uncontrolled open and slot trigger
- rename Nuxt module to morya-ui-nuxt for npm publish

### 文档

- add type sections at end of component docs
- document shared types and type link conventions
- document pt props and trim attrs boilerplate
- add attrs and types guides with updated nav

### 变更

- add component doc type section tooling
- add attrs audit and doc maintenance tooling
- apply hybrid attrs routing across library
- update documentation links to reflect new GitHub Pages URL
- rename satellite packages to @morya-ui scope

## 0.1.1

`morya-ui` 的初始公开版本（Morya UI），以当前组件库能力为基准。

### 组件（88 个）

- **基础**：Button、ButtonGroup、Icon、Avatar、AvatarGroup、Badge、Chip、Tag、Divider、Skeleton、ProgressBar、ProgressSpinner、BlockUI、ScrollTop
- **表单**：Input、Textarea、InputNumber、InputPassword、InputOtp、InputTags、InputColor、InputGroup、InputGroupAddon、IconField、FloatLabel、Label、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、Select、SelectButton、ToggleButton、Slider、Knob、Rating、DatePicker、AutoComplete、CascadeSelect、TreeSelect、FileUpload、Form、FormItem
- **浮层与对话框**：Dialog、Drawer、Popover、Tooltip、ConfirmDialog、ConfirmPopup、ContextMenu、Dropdown、SplitButton、SpeedDial
- **数据展示**：Table、Tree、TreeTable、TreeSelect、DataView、VirtualScroller、Timeline、MeterGroup、Terminal、Gallery、Carousel、Inplace
- **导航与菜单**：Menu、Menubar、MegaMenu、TieredMenu、Breadcrumb、Tabs、Stepper、Pagination、CommandMenu、Dock、Sidebar
- **布局**：Layout（Header / Sider / Content / Footer）、Grid、Flex、Space、Fluid、Panel、Card、Fieldset、Accordion、Splitter、Toolbar、Listbox、PickList、OrderList、Scrollbar

### 主题与设计令牌

- 亮/暗色主题（`useTheme`、`applyTheme`、`getPreferredTheme`）
- 密度与动效偏好（`useDensity`、`useMotion`，支持 `prefers-reduced-motion` 与 `data-m-motion`）
- 基于 `--m-*` CSS 变量的设计令牌体系（颜色、间距、圆角、阴影、边框、布局、树形、时间线、分割面板等）
- 子树级覆盖：`MConfigProvider` 注入主题、密度、动效与组件默认项

### 全局配置与工具 API

- 插件入口：`MoryaUI` 全量注册、`createMoryaUI` 按需/默认配置
- 按需构建：`MoryaUIResolver`（配合 `unplugin-vue-components`）
- ESM 子路径导出（`morya-ui/button` 等），tree-shaking 友好
- 命令式 API：`useConfirm`、`useToast` / `toast`、`useMessage` / `message`、`useContextMenu`
- 共享 composable：`useControllable`、`useFieldFeedback`、`useMenuKeyboard`、`useModalOverlay`、`useMId`
- 国际化：`zhCN`、`enUS`、`mergeLocale`、`useMLocale`、`formatLocale`

### 打包与类型

- 产物：ESM + 类型声明 + 聚合样式 `styles.css`
- 完整 TypeScript 类型（Props、Emits、Slots、Locale）
- `sideEffects` 与细粒度 exports，支持按组件引入样式

### 文档站

- 交互式文档站（Markdown + `vue preview` 实时示例）
- 组件目录、指南（快速上手、主题、配置、SSR、无障碍、MCP）
- 亮/暗主题切换、中英文切换、全局搜索（CommandMenu）
- 部署至 GitHub Pages：https://morya-space.github.io/morya-ui/

### 生态包

- **`@morya-ui/nuxt`**：Nuxt 3 模块（样式注入、transpile、客户端 overlay 上下文）
- **`@morya-ui/mcp`**：MCP 服务，供 AI 客户端检索组件文档、示例与用法建议

### SSR 与框架集成

- 兼容 Nuxt 3、Astro + Vue、Vite SSR 等场景（推荐 Vue 3.5+）
- 浮层统一挂载与 placement（flip / clamp）策略

### 无障碍

- 表单控件、Tabs、Slider、Switch、MeterGroup、ProgressSpinner 等核心路径的 ARIA 与键盘支持
- 菜单类组件统一键盘导航（`useMenuKeyboard`）
- Tree / TreeTable treegrid 语义

### 质量

- 600+ 单元测试用例
- `check:tokens` / `check:colors` 设计令牌校验
