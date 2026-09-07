# @roost-design/ui

## 0.1.3

### Fixes

- Fix docs site logo SVG gradient refs (`#rd-bg` / `#rd-mark`) so the mark renders correctly
- Restore backward-compat import paths (`wd-exports` / `wd-compat.css`)

### Docs

- Align guide, README, and MCP config examples with Roost Design branding and URLs
- Rename MCP bin to `roost-design-ui-mcp.js`

## 0.1.1

Initial public release of `@roost-design/ui` (Roost Design UI), using the current component library as the baseline.

### Components (88)

- **Basics**: Button, ButtonGroup, Icon, Avatar, AvatarGroup, Badge, Chip, Tag, Divider, Skeleton, ProgressBar, ProgressSpinner, BlockUI, ScrollTop
- **Forms**: Input, Textarea, InputNumber, InputPassword, InputOtp, InputTags, InputColor, InputGroup, InputGroupAddon, IconField, FloatLabel, Label, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Select, SelectButton, ToggleButton, Slider, Knob, Rating, DatePicker, AutoComplete, CascadeSelect, TreeSelect, FileUpload, Form, FormItem
- **Overlays & dialogs**: Dialog, Drawer, Popover, Tooltip, ConfirmDialog, ConfirmPopup, ContextMenu, Dropdown, SplitButton, SpeedDial
- **Data display**: Table, Tree, TreeTable, TreeSelect, DataView, VirtualScroller, Timeline, MeterGroup, Terminal, Gallery, Carousel, Inplace
- **Navigation & menus**: Menu, Menubar, MegaMenu, TieredMenu, Breadcrumb, Tabs, Stepper, Pagination, CommandMenu, Dock, Sidebar
- **Layout**: Layout (Header / Sider / Content / Footer), Grid, Flex, Space, Fluid, Panel, Card, Fieldset, Accordion, Splitter, Toolbar, Listbox, PickList, OrderList, Scrollbar

### Theme & design tokens

- Light / dark themes (`useTheme`, `applyTheme`, `getPreferredTheme`)
- Density and motion preferences (`useDensity`, `useMotion`, with `prefers-reduced-motion` and `data-rd-motion`)
- Token system on `--rd-*` CSS variables (color, spacing, radius, shadow, border, layout, tree, timeline, splitter, and more)
- Subtree overrides via `RdConfigProvider` (theme, density, motion, component defaults)
- Backward compatibility: `Wd*` component aliases and `--wd-*` token aliases (`wd-compat.css` / `wd-exports`)

### Global config & utilities

- Plugin entry: full registration with `RoostDesign`, defaults with `createRoostDesign`
- On-demand builds: `RoostDesignResolver` for `unplugin-vue-components`
- ESM subpath exports (`@roost-design/ui/button`, etc.) with tree-shaking
- Imperative APIs: `useConfirm`, `useToast` / `toast`, `useMessage` / `message`, `useContextMenu`
- Shared composables: `useControllable`, `useFieldFeedback`, `useMenuKeyboard`, `useModalOverlay`, `useRdId`
- i18n: `zhCN`, `enUS`, `mergeLocale`, `useRdLocale`, `formatLocale`

### Build output & types

- ESM + type declarations + bundled `styles.css`
- Full TypeScript coverage for props, emits, slots, and locale messages
- `sideEffects` and granular exports for per-component style imports

### Documentation site

- Interactive docs with Markdown and live `vue preview` examples
- Component catalog and guides (quick start, theme, config, SSR, accessibility, MCP)
- Light / dark theme, bilingual UI, global search (CommandMenu)
- Deployed to GitHub Pages: https://roost-design.github.io/roost-design-ui/

### Ecosystem packages

- **`@roost-design/nuxt`**: Nuxt 3 module (styles, transpile, client overlay context)
- **`@roost-design/ui-mcp`**: MCP server for AI clients to query component docs, examples, and usage guidance

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
