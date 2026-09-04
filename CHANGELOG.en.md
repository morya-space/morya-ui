# @wex-design/ui

## 0.1.1

Initial public release of `@wex-design/ui`, using the current component library as the baseline.

### Components (88)

- **Basics**: Button, ButtonGroup, Icon, Avatar, AvatarGroup, Badge, Chip, Tag, Divider, Skeleton, ProgressBar, ProgressSpinner, BlockUI, ScrollTop
- **Forms**: Input, Textarea, InputNumber, InputPassword, InputOtp, InputTags, InputColor, InputGroup, InputGroupAddon, IconField, FloatLabel, Label, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Select, SelectButton, ToggleButton, Slider, Knob, Rating, DatePicker, AutoComplete, CascadeSelect, TreeSelect, FileUpload, Form, FormItem
- **Overlays & dialogs**: Dialog, Drawer, Popover, Tooltip, ConfirmDialog, ConfirmPopup, ContextMenu, Dropdown, SplitButton, SpeedDial
- **Data display**: Table, Tree, TreeTable, TreeSelect, DataView, VirtualScroller, Timeline, MeterGroup, Terminal, Gallery, Carousel, Inplace
- **Navigation & menus**: Menu, Menubar, MegaMenu, TieredMenu, Breadcrumb, Tabs, Stepper, Pagination, CommandMenu, Dock, Sidebar
- **Layout**: Layout (Header / Sider / Content / Footer), Grid, Flex, Space, Fluid, Panel, Card, Fieldset, Accordion, Splitter, Toolbar, Listbox, PickList, OrderList, Scrollbar

### Theme & design tokens

- Light / dark themes (`useTheme`, `applyTheme`, `getPreferredTheme`)
- Density and motion preferences (`useDensity`, `useMotion`, with `prefers-reduced-motion` and `data-wd-motion`)
- Token system on `--wd-*` CSS variables (color, spacing, radius, shadow, border, layout, tree, timeline, splitter, and more)
- Subtree overrides via `WdConfigProvider` (theme, density, motion, component defaults)

### Global config & utilities

- Plugin entry: full registration with `WexDesign`, defaults with `createWexDesign`
- On-demand builds: `WexDesignResolver` for `unplugin-vue-components`
- ESM subpath exports (`@wex-design/ui/button`, etc.) with tree-shaking
- Imperative APIs: `useConfirm`, `useToast` / `toast`, `useMessage` / `message`, `useContextMenu`
- Shared composables: `useControllable`, `useFieldFeedback`, `useMenuKeyboard`, `useModalOverlay`, `useWdId`
- i18n: `zhCN`, `enUS`, `mergeLocale`, `useWdLocale`, `formatLocale`

### Build output & types

- ESM + type declarations + bundled `styles.css`
- Full TypeScript coverage for props, emits, slots, and locale messages
- `sideEffects` and granular exports for per-component style imports

### Documentation site

- Interactive docs with Markdown and live `vue preview` examples
- Component catalog and guides (quick start, theme, config, SSR, accessibility)
- Light / dark theme, bilingual UI, global search (CommandMenu)
- Deployed to GitHub Pages: https://wex-design.github.io/wex-design-ui/

### Ecosystem packages

- **`@wex-design/nuxt`**: Nuxt 3 module (styles, transpile, client overlay context)
- **`@wex-design/ui-mcp`**: MCP server for AI clients to query component docs, examples, and usage guidance

### SSR & framework integration

- Works with Nuxt 3, Astro + Vue, Vite SSR, and similar setups
- Unified overlay mounting and placement (flip / clamp) strategy

### Accessibility

- ARIA and keyboard support on core paths (forms, Tabs, Slider, Switch, MeterGroup, ProgressSpinner, etc.)
- Unified menu keyboard navigation (`useMenuKeyboard`)
- Tree / TreeTable treegrid semantics

### Quality

- 600+ unit tests
- Design token checks via `check:tokens` and `check:colors`
