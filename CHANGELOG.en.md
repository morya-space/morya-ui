# @well-insight/ui

## 0.1.13

### Features

- implement dynamic icon sizing across components
- enhance resource management and documentation in MCP

## 0.1.12

### Changes

- import Icon styles across multiple components

## 0.1.11

### Breaking Changes

- drop deprecated prop and CSS aliases

### Features

- add mobile sidebar drawer for docs and components
- add global site search with CommandMenu
- persist language in URL query
- add dedicated 404 page
- add favicon and meta description
- Harden MCP catalog tooling

### Fixes

- unify suffix icons and Select clearable hover behavior
- restore DatePicker panel grid after teleport
- add invalid modifier class alongside error alias
- improve FloatLabel, Popover, and Slider
- scroll doc TOC inside WiScrollbar
- repair guide links and quick-start copy
- Fix layout header and footer padding axis

### Docs

- complete Events/Slots sections and remove migration guide
- add Events and a11y sections to high-traffic components
- rename Basic sections to 基础用法 in Chinese component docs
- add accessibility guide for playground
- expand menu and virtual scroller component pages
- add deprecated API migration guide

### Changes

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

### Fixes

- Expose component-specific CSS variables and adjust layout defaults
- Add Configurable Layout Sizing And CSS Tokens
- Improve playground navigation styling
- Standardize Project Linting And Module Exports

## 0.1.9

### Changes

- clean up whitespace in base.css for consistency

## 0.1.8

### Features

- enhance package exports and sideEffects for improved component management

## 0.1.7

### Features

- add extra slot and enhance components in Accordion and AutoComplete
- enhance component defaults and improve configuration management
- add component registry import to index for improved component management

## 0.1.6

### Features

- enhance documentation and component registration for WellInsight

## 0.1.5

### Features

- enhance release process to include MCP build and version sync

### Fixes

- rename Wd to Wi in component library and documentation

## 0.1.4

### Changes

- Simplify package.json exports by removing development paths for styles and index files

## 0.1.3

### Features

- bootstrap standalone @well-insight/ui component library

### Changes

- restructure release process and update documentation

## 0.1.2

### Features

- 增强文件上传组件，添加多语言支持和样式优化
- 文件上传组件优化
- 侧边抽屉动效样式优化
- 弹窗样式动效优化

## 0.1.1

### Features

- 更新发版流程，添加 UI 组件的发布命令和文档说明
- 添加 commitlint 配置和 husky 钩子，优化发版流程和提交规范文档

## 0.1.0

### Minor Changes

- Initial release: a standalone Vue 3 + TypeScript component library with theme / design-token APIs.
- Ships a full component docs site with Markdown and live `vue preview` examples.
- Light / dark themes, `useTheme` / `useDensity` / `useMotion`, plus `WiConfigProvider` / `createWellInsight` for global defaults.
- Build output is ESM + type declarations + `styles.css`. Local development can resolve source via `exports.development`.

### Coverage

Primitives, forms, overlays, data display, navigation, and feedback (Button, Input, Select, Dialog, Table, Tree, Toast, and more). See the Components page in the docs site.
