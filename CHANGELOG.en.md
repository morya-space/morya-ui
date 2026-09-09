# morya-ui

## 0.2.0

### Features

- enhance design token management and documentation
- add reduced motion policy support across components
- integrate MScrollbar into AutoComplete, CascadeSelect, CommandMenu, and Listbox components
- enhance MSelect component with scrollbar and max-height functionality

## 0.1.2

### Changes

- migrate to M design tokens and remove legacy compat layers

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
- Deployed to GitHub Pages: https://morya-ui.github.io/morya-ui/

### Ecosystem packages

- **`@morya-space/nuxt`**: Nuxt 3 module (styles, transpile, client overlay context)
- **`morya-ui-mcp`**: MCP server for AI clients to query component docs, examples, and usage guidance

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
