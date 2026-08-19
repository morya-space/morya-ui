---
name: vue3-component-library
description: Vue3 + TypeScript 本地组件库工程与质量规范。用于新建、设计、实现、重构或审查可复用 UI 组件、组件包、组件主题、组件动效、组件文档或发布 API；即使用户只提到 Button、Input、Dialog、Table、组件库、设计系统、组件规范、主题色或组件样式，也应优先使用本 skill。涵盖设计令牌消费、亮暗与自定义主题、组件 API、一致性交互、无障碍、动效、测试、文档和兼容性。
---

# Vue3 Component Library

建立可长期维护、可独立复用的 Vue 3 + TypeScript 组件库。组件库的目标是提供稳定的公共 API 和一致的体验，而不只是完成当前页面；默认使用 Vue 3、`<script setup lang="ts">` 与严格 TypeScript。

## 与相邻 Skills 的边界

- 使用 `theme-system` 设计或调整全局 token 架构、主题格式及主题持久化；本 skill 规定组件**如何消费** token，避免组件自行定义另一套主题。
- 使用 `vue3-component-design` 处理单个组件的 Props、Emits、`v-model`、Slots 与组合模式细节。
- 使用 `vue3-unit-testing` 编写组件、composable、主题状态和无障碍交互测试；不要把测试细节全部塞进本 skill。
- 涉及复杂交互无障碍时，使用 `fixing-accessibility`；涉及卡顿或动效性能问题时，使用 `fixing-motion-performance`。
- 本 skill 不绑定业务领域、低代码平台、UI 框架、CSS 预处理器或具体构建工具。优先遵循仓库既有约定。

## 工作流程

1. **先调查再实现**：阅读组件入口、现有 token、相邻同类组件、导出方式、测试和文档配置。不得默认检查 `node_modules`、缓存或 vendor 目录。
2. **明确公共契约**：在编码前列出组件用途、支持的尺寸/变体/状态、Props、事件、Slots、`v-model`、可访问性行为和不支持的范围。
3. **复用设计系统**：先选择语义 token 和组件 token，再写结构与样式；不要在组件中散落品牌色、像素间距、阴影或时长。
4. **实现状态完整性**：覆盖默认、hover、active、focus-visible、disabled、loading、error、empty、selected 等实际适用状态。
5. **验证消费者视角**：验证类型、键盘操作、主题切换、关键交互和打包入口。新增公共 API 时同步文档和测试。

## 推荐分层与目录

按项目规模调整，但保持依赖方向从基础到组合：

```text
packages/ui/
├── src/
│   ├── tokens/             # token 类型、默认主题、主题入口
│   ├── styles/             # reset、全局 token、基础样式
│   ├── composables/        # 跨组件交互逻辑
│   ├── components/
│   │   ├── button/
│   │   │   ├── Button.vue
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   ├── Button.test.ts
│   │   │   └── README.md
│   │   └── ...
│   └── index.ts
└── package.json
```

组件分层建议：

- **基础（primitives）**：Button、Icon、Text、Divider、Spinner，保持小而稳定。
- **输入与数据（controls/data）**：Input、Select、Form、Table、Pagination，明确值、校验、加载和空状态。
- **反馈与覆盖层（feedback/overlays）**：Alert、Toast、Dialog、Popover、Tooltip；处理焦点、层级和关闭路径。
- **组合组件（composites）**：Card、Descriptions、Upload 等；组合基础组件，不复制其交互或样式逻辑。

基础层不得依赖组合层或业务组件。不要把页面级业务流程、接口请求、路由跳转或产品文案固化进通用组件。

## 公共 API 设计

### 组件命名与导出

- 使用一致的组件前缀和 PascalCase 导出名；目录命名遵循当前仓库规范。
- 每个公开组件提供稳定的 `index.ts`，默认导出组件并导出 Props、Emits、实例类型和相关公共类型。
- 将内部实现类型、私有 composable、私有样式排除在包入口之外。
- 新增、弃用或移除公共 API 时记录兼容性影响；移除或改义现有 Prop/Event 属于破坏性变更。

```ts
export { default as AcmeButton } from "./Button.vue";
export type { ButtonEmits, ButtonProps, ButtonInstance } from "./types";
```

### Props、事件和 Slots

- Prop 名描述意图，不描述内部实现；例如 `variant`、`size`、`loading`、`disabled`，而非 `blue`、`smallPadding`。
- 只提供有真实用例的变体。变体爆炸时，优先抽象 token、组合或 slot，而不是不断添加布尔 Prop。
- 事件使用过去式或用户动作命名，例如 `click`、`change`、`visible-change`；每个事件的触发时机和参数必须明确。
- 文本、图标、操作区等可扩展区域优先使用具名 Slots，并给出适当默认值或无内容行为。
- 原生控件包装组件要透传合适的 attribute、`disabled`、`name`、`aria-*` 和 ref，不要吞掉消费者必要能力。
- 使用 `v-model` 时，保证外部值是唯一事实来源，避免同步双份可变状态。

### 受控状态与实例能力

- 由 Prop 驱动的状态不要直接修改；需要临时交互状态时，建立明确的内部状态和同步规则。
- `Dialog`、`Popover` 等可见性组件必须提供可预测的关闭来源（按钮、遮罩、Escape、编程控制）并发出一致事件。
- 只有消费者确实需要命令式能力时才通过 `defineExpose` 暴露 `focus()`、`validate()`、`open()` 等方法，并为 SSR 或未挂载状态设计安全行为。

## 设计令牌和主题

### 三层 token 模型

用 token 将品牌选择与组件实现解耦：

1. **基础 token**：色阶、原始尺寸、字体族、曲线等，例如 `--acme-blue-600`、`--acme-space-2`。
2. **语义 token**：表达界面角色，例如 `--acme-color-text-primary`、`--acme-color-surface`、`--acme-color-border`。
3. **组件 token**：表达组件内的可覆盖契约，例如 `--acme-button-primary-bg`、`--acme-dialog-width`。

组件样式优先使用组件 token；组件 token 映射到语义 token；主题只重写必要的基础或语义 token。不要让每个组件直接引用原始色阶，否则主题切换会变得脆弱。

```css
:root {
  --acme-color-brand-solid: #2563eb;
  --acme-color-text-on-brand: #fff;
  --acme-color-focus-ring: #2563eb;
  --acme-motion-duration-fast: 150ms;
  --acme-motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

.acme-button {
  --acme-button-primary-bg: var(--acme-color-brand-solid);
  --acme-button-primary-fg: var(--acme-color-text-on-brand);
  --acme-button-focus-ring: var(--acme-color-focus-ring);
}

.acme-button--primary {
  color: var(--acme-button-primary-fg);
  background: var(--acme-button-primary-bg);
}
```

### 主题规则

- 使用统一库前缀，避免污染宿主应用变量；变量命名保持 kebab-case 且按语义分组。
- 亮色、暗色、高对比度和品牌主题使用相同的语义 token 名称，以根元素或明确主题容器覆盖变量。
- 组件 token 可以挂在组件根节点，便于局部定制；不要通过深层选择器修改组件内部结构。
- 颜色至少覆盖 `surface`、`text`、`text-muted`、`border`、`brand`、`success`、`warning`、`danger`、`focus-ring` 及各交互状态。
- token 还应包含间距、尺寸、圆角、字体、字号、行高、阴影、z-index、透明度、断点和 motion。固定值仅用于真正不可配置的几何细节。
- 主题初始化应尽早执行，避免首屏闪烁；遵从用户的 `prefers-color-scheme` 和 `prefers-reduced-motion` 偏好，并允许产品设置覆盖。

## 样式与视觉一致性

- 为每个组件定义根 class、元素 class、状态/变体修饰符，例如 `.acme-button__icon`、`.acme-button--loading`。不要依赖 DOM 层级或标签名作为公开样式 API。
- 样式默认以组件根为边界。谨慎使用 `scoped`：它可以避免泄漏，但会阻碍某些主题和覆盖策略；按仓库方案统一选择，而非混用。
- 为尺寸变体规定一致的高度、水平内边距、字号、图标尺寸和触控目标；相同 `size` 在同类组件中应含义一致。
- `disabled` 不等同于视觉变淡：同时阻止交互、正确传递原生禁用语义，并避免不可读的对比度。
- 使用 z-index token 管理 Dropdown、Popover、Modal、Toast 等层级，避免任意大数。
- 对外提供的 class、CSS 变量、`part` 或样式插槽都属于 API，改动时评估兼容性。

## 动效与交互反馈

动效应帮助理解状态变化，而不是装饰或延迟操作。

- 所有 transition 使用 motion token；优先 `opacity`、`transform`，避免在频繁交互中动画 `width`、`height`、`top`、`left`、大面积 `filter`。
- 为 hover、press、focus、展开收起、遮罩与加载状态使用短且可预测的过渡；用户操作应立即有反馈。
- 对 Dialog、Drawer、Collapse 等进入/离开动效使用 Vue `<Transition>`，并保证结束状态与无动画状态一致。
- `prefers-reduced-motion: reduce` 下移除非必要位移、缩放和循环动效，保留即时的状态切换。
- 加载状态保持布局稳定：保留按钮宽度、输入高度、表格行高度等，避免跳动。
- 不要让纯装饰动效阻塞键盘操作、焦点转移、关闭动作或异步请求。

```css
.acme-button {
  transition:
    background-color var(--acme-motion-duration-fast)
      var(--acme-motion-ease-standard),
    color var(--acme-motion-duration-fast) var(--acme-motion-ease-standard),
    transform var(--acme-motion-duration-fast) var(--acme-motion-ease-standard);
}

@media (prefers-reduced-motion: reduce) {
  .acme-button {
    transition-duration: 0ms;
  }
}
```

## 无障碍与交互基线

- 能使用原生元素时使用原生元素。图标按钮必须有可访问名称。
- 键盘可到达的元素必须具有清晰的 `:focus-visible` 指示，并使用 focus-ring token。
- 自定义 Select、Menu、Tabs、Dialog、Tooltip 等复杂组件，需要定义完整键盘模型、ARIA 关系和焦点生命周期；不要只实现鼠标路径。
- Modal/Dialog 打开后管理焦点，关闭后恢复到合理触发元素；提供 Escape 关闭（除非业务明确禁止且有替代方案）。
- 表单组件应关联 label、help、error，并正确反映 `required`、`invalid`、`disabled`、`readonly` 状态。
- 不要仅通过颜色、动效或图标表达状态；提供文本、语义或可访问说明作为补充。

## 测试、文档和发布

### 最小交付

每个新公开组件至少包含：

- Props、事件、Slots、默认值和受控行为的类型/单元测试。
- 关键状态视觉验证：默认、变体、尺寸、禁用、加载、错误及主题切换（适用时）。
- 键盘与焦点测试；覆盖层组件还应测试关闭和焦点恢复。
- 可运行示例或 Story，展示基础用法、复杂 slots、受控用法及边界状态。
- README/API 文档：用途、导入方式、Props、Events、Slots、暴露方法、无障碍注意事项和主题覆盖示例。

### 兼容性

- 将 Props、Events、Slots、公开 CSS 变量、导出类型和实例方法视为公共 API。
- 新增可选能力通常为向后兼容；重命名、删除、改变默认值或事件时序时，提供迁移说明并遵循项目版本策略。
- 组件库打包入口不得意外引入应用实例、全局状态或样式副作用；全局样式应显式导入并文档化。

## 完成前检查

- [ ] 调查并复用了现有组件、命名、token 和导出约定。
- [ ] 组件边界清晰，未引入业务 API、路由或页面级状态。
- [ ] Props、Events、Slots、`v-model`、暴露方法均有明确且已文档化的契约。
- [ ] 样式使用语义/组件 token，没有散落品牌色、间距、阴影和动画时长。
- [ ] 亮暗或自定义主题下的文本、边框、表面和焦点环仍可辨识。
- [ ] 所有适用状态和键盘路径均可用，焦点行为正确。
- [ ] 动效使用 token，支持减少动态效果，并避免布局抖动。
- [ ] 类型检查、组件测试、构建和相关视觉/交互验证已运行或明确说明未运行原因；组件测试遵循 `vue3-unit-testing`。
