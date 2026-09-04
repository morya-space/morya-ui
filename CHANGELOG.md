# @wex-design/ui

## 0.1.1

`@wex-design/ui` 的初始公开版本，以当前组件库能力为基准。

### 组件（88 个）

- **基础**：Button、ButtonGroup、Icon、Avatar、AvatarGroup、Badge、Chip、Tag、Divider、Skeleton、ProgressBar、ProgressSpinner、BlockUI、ScrollTop
- **表单**：Input、Textarea、InputNumber、InputPassword、InputOtp、InputTags、InputColor、InputGroup、InputGroupAddon、IconField、FloatLabel、Label、Checkbox、CheckboxGroup、Radio、RadioGroup、Switch、Select、SelectButton、ToggleButton、Slider、Knob、Rating、DatePicker、AutoComplete、CascadeSelect、TreeSelect、FileUpload、Form、FormItem
- **浮层与对话框**：Dialog、Drawer、Popover、Tooltip、ConfirmDialog、ConfirmPopup、ContextMenu、Dropdown、SplitButton、SpeedDial
- **数据展示**：Table、Tree、TreeTable、TreeSelect、DataView、VirtualScroller、Timeline、MeterGroup、Terminal、Gallery、Carousel、Inplace
- **导航与菜单**：Menu、Menubar、MegaMenu、TieredMenu、Breadcrumb、Tabs、Stepper、Pagination、CommandMenu、Dock、Sidebar
- **布局**：Layout（Header / Sider / Content / Footer）、Grid、Flex、Space、Fluid、Panel、Card、Fieldset、Accordion、Splitter、Toolbar、Listbox、PickList、OrderList、Scrollbar

### 主题与设计令牌

- 亮/暗色主题（`useTheme`、`applyTheme`、`getPreferredTheme`）
- 密度与动效偏好（`useDensity`、`useMotion`，支持 `prefers-reduced-motion` 与 `data-wd-motion`）
- 基于 `--wd-*` CSS 变量的设计令牌体系（颜色、间距、圆角、阴影、边框、布局、树形、时间线、分割面板等）
- 子树级覆盖：`WdConfigProvider` 注入主题、密度、动效与组件默认项

### 全局配置与工具 API

- 插件入口：`WexDesign` 全量注册、`createWexDesign` 按需/默认配置
- 按需构建：`WexDesignResolver`（配合 `unplugin-vue-components`）
- ESM 子路径导出（`@wex-design/ui/button` 等），tree-shaking 友好
- 命令式 API：`useConfirm`、`useToast` / `toast`、`useMessage` / `message`、`useContextMenu`
- 共享 composable：`useControllable`、`useFieldFeedback`、`useMenuKeyboard`、`useModalOverlay`、`useWdId`
- 国际化：`zhCN`、`enUS`、`mergeLocale`、`useWdLocale`、`formatLocale`

### 打包与类型

- 产物：ESM + 类型声明 + 聚合样式 `styles.css`
- 完整 TypeScript 类型（Props、Emits、Slots、Locale）
- `sideEffects` 与细粒度 exports，支持按组件引入样式

### 文档站

- 交互式文档站（Markdown + `vue preview` 实时示例）
- 组件目录、指南（快速上手、主题、配置、SSR、无障碍）
- 亮/暗主题切换、中英文切换、全局搜索（CommandMenu）
- 部署至 GitHub Pages：https://wex-design.github.io/wex-design-ui/

### 生态包

- **`@wex-design/nuxt`**：Nuxt 3 模块（样式注入、transpile、客户端 overlay 上下文）
- **`@wex-design/ui-mcp`**：MCP 服务，供 AI 客户端检索组件文档、示例与用法建议

### SSR 与框架集成

- 兼容 Nuxt 3、Astro + Vue、Vite SSR 等场景
- 浮层统一挂载与 placement（flip / clamp）策略

### 无障碍

- 表单控件、Tabs、Slider、Switch、MeterGroup、ProgressSpinner 等核心路径的 ARIA 与键盘支持
- 菜单类组件统一键盘导航（`useMenuKeyboard`）
- Tree / TreeTable treegrid 语义

### 质量

- 600+ 单元测试用例
- `check:tokens` / `check:colors` 设计令牌校验
