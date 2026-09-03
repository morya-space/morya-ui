# @well-insight/ui

## 0.1.14（未发布）

### 破坏性变更 / 弃用别名

- **Severity**：正典值为 `success` / `info` / `warning` / `danger`；`warn`、`error` 仍接受但已标记 `@deprecated`（影响 Button、Tag、Message、Toast、ProgressBar、Badge、Chip、Timeline 等）。
- **Knob**：`size` 弃用，请改用 `diameter`（别名仍可用）。
- **Avatar**：正典尺寸词表为 `small` / `medium` / `large` / `xlarge`；`normal`、`sm`、`md`、`lg` 仍映射为别名。
- **Panel**：`modelValue` / `v-model` 弃用，请改用 `collapsed` / `v-model:collapsed`（双轨同步 emit 保留至下一 major）。

### 新功能

- **`useConfirm`**：命令式确认对话框 API，自包入口导出。
- **`useControllable`**：共享半受控/受控状态 composable，用于 Panel、Fieldset、Carousel、DataView 等。
- **`ConfigProvider`**：`theme` 对象注入（密度、动效、`data-wi-*` 语义）。
- **Toast / Message**：队列、去重与 severity 正典对齐。
- **浮层**：`overlayPlacement` 支持 flip/clamp；Popover / Tooltip / BlockUI 行为补强。
- **键盘导航**：`useMenuKeyboard` 统一 Menu、Menubar、MegaMenu、Listbox、SelectButton 等。
- **Tree / TreeTable**：treegrid 语义与键盘；**Gallery / Carousel** 受控 page 与触摸/暂停。
- **Form**：字段反馈基线、`useFieldFeedback`；Dialog / Drawer / ConfirmDialog prop 对齐。
- **主题 token**：边框宽度、禁用透明度、动效（spin/skeleton/pulse/scrollbar）、减动效（`prefers-reduced-motion` 与 `data-wi-motion`）；新增 layout/tree/timeline/splitter 等布局 token。
- **Grid**：`gap` 支持设计 token 解析（`resolveGapCSSValue`）。

### 修复

- Checkbox / Radio 暗色选中态；ToggleButton 水平 padding；Dock `position`；Stepper 状态样式；Chip severity。
- PickList / OrderList 样式与按钮禁用；InputNumber 草稿态；Table 死代码与排序；TieredMenu popup 定位。
- CascadeSelect / TreeSelect 键盘；SplitButton / SpeedDial 浮层；Rating / Knob slider 语义；DatePicker 日历键盘。
- Inplace / ConfirmPopup 行为；DataView / Terminal 半受控；InputColor 模板损坏修复。

### 无障碍

- Divider 恒设 `role="separator"`；Tabs `aria-controls` / panel `aria-labelledby`；Toolbar `ariaLabel`；Slider `aria-valuetext`。
- Switch 无 label 时 DEV 警告；MeterGroup `aria-valuenow`；InputPassword 强度 `role="meter"`。
- ProgressSpinner 包裹模式 `inert` + `aria-busy`；CheckboxGroup / RadioGroup / SelectButton / InputOtp 组标签。
- Card `headingLevel`；hover / focus-visible 补齐（SplitButton、SpeedDial、FileUpload、MegaMenu、Sidebar 等）。

### 测试

- 608 项用例全绿；Knob、Inplace、TreeTable、Carousel、MeterGroup、ProgressSpinner、Tabs、CheckboxGroup 等核心路径加固。

### 文档

- `check:docs` 报告模式：当前 **262** 条文档-实现漂移（`audits/docs-drift-report.md`），待后续批次清零；`check:tokens` / `check:colors` 已通过。

## 0.1.13

### 新功能

- implement dynamic icon sizing across components
- enhance resource management and documentation in MCP

## 0.1.12

### 变更

- import Icon styles across multiple components

## 0.1.11

### 破坏性变更

- drop deprecated prop and CSS aliases

### 新功能

- add mobile sidebar drawer for docs and components
- add global site search with CommandMenu
- persist language in URL query
- add dedicated 404 page
- add favicon and meta description
- Harden MCP catalog tooling

### 修复

- unify suffix icons and Select clearable hover behavior
- restore DatePicker panel grid after teleport
- add invalid modifier class alongside error alias
- improve FloatLabel, Popover, and Slider
- scroll doc TOC inside WiScrollbar
- repair guide links and quick-start copy
- Fix layout header and footer padding axis

### 文档

- complete Events/Slots sections and remove migration guide
- add Events and a11y sections to high-traffic components
- rename Basic sections to 基础用法 in Chinese component docs
- add accessibility guide for playground
- expand menu and virtual scroller component pages
- add deprecated API migration guide

### 变更

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

## 0.1.10

### 修复

- Expose component-specific CSS variables and adjust layout defaults
- Add Configurable Layout Sizing And CSS Tokens
- Improve playground navigation styling
- Standardize Project Linting And Module Exports

## 0.1.9

### 变更

- clean up whitespace in base.css for consistency

## 0.1.8

### 新功能

- enhance package exports and sideEffects for improved component management

## 0.1.7

### 新功能

- add extra slot and enhance components in Accordion and AutoComplete
- enhance component defaults and improve configuration management
- add component registry import to index for improved component management

## 0.1.6

### 新功能

- enhance documentation and component registration for WellInsight

## 0.1.5

### 新功能

- enhance release process to include MCP build and version sync

### 修复

- rename Wd to Wi in component library and documentation

## 0.1.4

### 变更

- Simplify package.json exports by removing development paths for styles and index files

## 0.1.3

### 新功能

- bootstrap standalone @well-insight/ui component library

### 变更

- restructure release process and update documentation

## 0.1.2

### 新功能

- 增强文件上传组件，添加多语言支持和样式优化
- 文件上传组件优化
- 侧边抽屉动效样式优化
- 弹窗样式动效优化

## 0.1.1

### 新功能

- 更新发版流程，添加 UI 组件的发布命令和文档说明
- 添加 commitlint 配置和 husky 钩子，优化发版流程和提交规范文档

## 0.1.0

### Minor Changes

- 初版发布：可独立安装的 Vue 3 + TypeScript 组件库（含主题 / 设计令牌 API）。
- 提供完整组件文档站，支持 Markdown 与 `vue preview` 实时示例。
- 亮色 / 暗色主题、`useTheme` / `useDensity` / `useMotion`，以及 `WiConfigProvider` / `createWellInsight` 全局配置。
- 打包产物为 ESM + 类型声明 + `styles.css`；本地开发可通过 `exports.development` 直连源码。

### 覆盖范围

基础与表单、浮层、数据展示、导航与反馈等组件（Button、Input、Select、Dialog、Table、Tree、Toast 等），详见文档站「组件」页。
