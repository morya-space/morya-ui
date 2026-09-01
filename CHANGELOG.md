# @well-insight/ui

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
