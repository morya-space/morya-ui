# UI 组件库与文档站优化路线图

本文档记录 `@well-insight/ui` 组件实现与 playground 文档站的已知优化方向、优先级与实施进度。  
维护者可在完成一项后将 `[ ]` 改为 `[x]`，并在「变更记录」追加说明。

---

## 现状概览

| 维度 | 现状 | 主要缺口 |
| --- | --- | --- |
| 组件文档 | 88 组件均有中英 `docs/` | Events / Slots / 无障碍章节覆盖不均 |
| 组件测试 | 88 顶层组件均有测试 | 16 个子组件无独立测试；部分仅 smoke test |
| 无障碍 | 核心表单/浮层部分完善 | FloatLabel、Popover、Slider、Tooltip、Badge 等 |
| 代码复用 | `shared/` 有 overlay teleport | Menu 节点树、Overlay 定位逻辑多处重复 |
| 文档站性能 | 功能完整 | 首包 ~6MB（eager 加载全部 markdown） |
| 文档站 UX | 组件侧栏可筛选 | 全局搜索已加；移动端 drawer 已加；薄文档与 a11y 指南待补 |

---

## 阶段一：快修（内容 + 小 UX + 高影响 a11y）

目标：低风险、可独立合并，1–2 天。

- [x] 建立本优化路线图文档
- [x] 修复指南死链与重复段落（introduction / guide / quick-start）
- [x] introduction「下一步」补充 MCP 链接
- [x] 修复 `ComponentDocViewer` TOC 在 `WiScrollbar` 内的锚点滚动
- [x] 无障碍：`FloatLabel` label 关联
- [x] 无障碍：`Popover` trigger ARIA
- [x] 无障碍：`Slider` 单 thumb `aria-label`

---

## 阶段二：文档站性能

目标：首屏 JS 显著下降，路由与文档按需加载。

- [x] 路由视图改为 dynamic `import()`
- [x] 组件文档 loader 去掉 `eager: true`，按 slug 动态加载
- [x] 指南 markdown 按需加载
- [x] 构建验证：chunk 体积与 Vite warning（主入口 ~37KB；ComponentPlayground ~546KB 待继续拆分）
- [ ] （可选）`manualChunks` 拆分 vendor / shiki

---

## 阶段三：文档站 UX

- [x] 全局搜索（复用 `WiCommandMenu`，Cmd/Ctrl+K）
- [x] 移动端侧栏 drawer（`<700px`，组件页 + 指南页）
- [x] 路由 `scrollBehavior` 支持 hash
- [x] 独立 404 页；收窄 `/:component` 兼容重定向
- [x] URL 反映语言（`?lang=en-US`）
- [x] `index.html` favicon + meta description

---

## 阶段四：组件 API 与文档质量

- [x] deprecated prop 迁移说明（`error`→`invalid`、`block`→`fluid` 等）
- [ ] CSS 修饰类 `--error` 与 `invalid` prop 命名对齐（逐步）
- [ ] 补薄文档：CommandMenu、TieredMenu、MegaMenu、VirtualScroller
- [ ] 补 Events / Slots 缺失章节（按使用频率排序）
- [ ] 中文文档小节标题统一（如 `## 基础用法` 替代 `## Basic`）
- [ ] 新增无障碍指南页（playground `/docs/accessibility`）

---

## 阶段五：架构与测试（中长期）

- [ ] 抽取 `shared/menu/` 复用 Menu 族节点渲染
- [ ] 抽取 overlay placement 工具（Tooltip / Popover / Select 等）
- [ ] 硬编码色值/token 清理（Terminal、FileUpload overlay 等）
- [ ] 16 个子组件补测试（MenuNodes、FormItem、LayoutSider 等）
- [ ] 交互组件 a11y / 键盘测试补强

---

## 变更记录

| 日期 | 阶段 | 说明 |
| --- | --- | --- |
| 2026-09-01 | 一 | 修复指南死链/重复；MCP 链接；TOC 滚动；FloatLabel/Popover/Slider a11y |
| 2026-09-01 | 二 | 路由 lazy + 组件/指南文档按需加载 |
| 2026-09-01 | 三 | 全局搜索；移动端 drawer；404/favicon/lang URL/hash 滚动 |
| 2026-09-01 | 四 | 新增指南页 `/docs/migration`（deprecated props 对照） |

---

## 相关文档

- [DEVELOPMENT.md](./DEVELOPMENT.md) — 本地开发与发布
- [ui-development.md](./ui-development.md) — 组件开发约定
- [playground MCP 指南](../playground/src/docs/guide/mcp.md) — MCP 接入
