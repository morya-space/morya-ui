# morya-ui × ant-design 对标路线图

> 状态：**Phase 4 质量门落地**（size-limit / docs-smoke / visual fixtures）；Phase 3 余项：可选 `MApp`、Cascader search/multi  
> 受众：维护者  
> 目标：对齐 ant-design **文档站信息架构与完整度**、补齐企业刚需组件映射，同时保留 morya 自有 API（`severity` / `variant` / `--m-*`）与 Vue 技术栈。  
> 原则：**学结构，不硬迁 dumi；学完整度，不无脑复制全部 demo。**

## 结论摘要

| 维度     | 判断                                                         |
| -------- | ------------------------------------------------------------ |
| 组件数量 | morya 已约 90+，总体不弱于 antd；部分命名/语义需映射说明     |
| 真正差距 | 文档站信息架构、设计规范表达、主题工具、国际化广度、质量体系 |
| 第一优先 | 文档站体验（总览、文档模板、首页、导航）                     |

## 阶段划分

### Phase 1 — 文档站「看起来像产品」

- [x] 建立本路线图，并挂到维护者文档索引
- [x] 组件总览卡片化：整卡可点、搜索同步过滤、分类徽章与密度对齐 antd Overview
- [x] 组件文档模板标准化：何时使用 / Demo / API / FAQ（Token / Semantic DOM 先占位）
- [x] 以 Button 中英文文档作示范改造
- [x] 首页增加组件墙 + 主题即时预览条
- [x] 顶栏/页脚增加「设计」「主题编辑」占位入口（可先落到指南 stub）

### Phase 2 — 对标关键页（进行中）

- [x] 独立 Theme Editor 页（`/theme-editor`：预览 + 导出 CSS / `createTheme`）
- [x] Design Spec 第一批：颜色、字体、间距、布局、动效、反馈
- [x] Common Props 页 + Semantic DOM 约定落地（Button 示范）
- [x] Changelog 已在主导航；Agents 进页脚（指向 AI 接入）；Blog 暂不做
- [ ] 组件文档 frontmatter 扩展：`subtitle`、`cover`、`group.order`（可选）

### Phase 3 — 组件映射与国际化

- [x] Float 入口收敛（文档映射：`FloatButton` ↔ `SpeedDial` / `ScrollTop` / `Dock`；指南见 `/docs/antd-mapping`）
- [x] Transfer 语义（`PickList` 文档定位 + 映射表）
- [x] TimePicker 独立入口（`MTimePicker` 薄封装 `DatePicker type="time"`）
- [x] ColorPicker 能力与文档（保留 `InputColor` 命名；映射说明边界）
- [x] Cascader 深度（多级嵌套 demo + 诚实写明无 search/multi/loadData；能力扩展仍 backlog）
- [ ] 可选轻量 `MApp` 统一 toast / message / modal 上下文
- [x] locale 扩展：`ja-JP`、`ko-KR`、`zh-TW`、`fr-FR`、`de-DE`、`es-ES`、`ru-RU`、`pt-BR`

### Phase 4 — 质量与可发现性

- [x] 视觉回归（关键组件截图：`pnpm test:visual` / `tests/visual` + `.github/workflows/quality-check.yml`）
- [x] 文档站路由 smoke / a11y 基础检查（`pnpm check:docs-smoke`：SEO shell + lang/landmark/title）
- [x] bundle size 预算（`pnpm check:size` + `.size-limit.json`）
- [x] sitemap / `llms.txt` / for-agents 文档（`build:docs:pages` 写出 sitemap+robots+llms.txt；指南 `/docs/for-agents`）
- [x] 强制每个组件：何时使用 + 基础 demo + API（`pnpm check:docs-skeleton` + `.github/workflows/docs-check.yml`）

## 组件映射备忘

| antd                 | morya 现状                   | 策略                                 |
| -------------------- | ---------------------------- | ------------------------------------ |
| FloatButton          | SpeedDial / ScrollTop / Dock | 文档映射（`/docs/antd-mapping`）     |
| Transfer             | PickList                     | 文档定位为穿梭语义                   |
| TimePicker           | `MTimePicker` + DatePicker   | 独立入口已导出                       |
| ColorPicker          | InputColor                   | 保留命名；文档说明面板边界           |
| Cascader             | CascadeSelect                | 多级 demo 已补；search/multi backlog |
| App                  | installer / ConfigProvider   | 可选 `MApp`（未做）                  |
| Masonry / BorderBeam | 无                           | 中低优先级                           |

## 明确不做（本周期）

- 整站迁移到 dumi / 复制 antd 视觉皮肤
- 为对齐而改掉 morya 既有 API 词汇
- 一次性抄完全部 antd demo 与 70+ locale

## 验收标准（Phase 1）

1. `/components` 总览在搜索时同步过滤卡片，且整卡可进入文档
2. 仓库内有可复用的组件文档模板；Button 中英文符合新骨架
3. 首页可见组件抽样墙与主题预览交互
4. 导航可见「设计」「主题」入口，对应指南页可打开（允许 stub）

## 验收标准（Phase 2 已完成项）

1. `/theme-editor` 可调主色 / 圆角 / 密度 / 动效，预览组件，并复制 `createTheme` 或 CSS
2. Design Spec 章节（色彩…反馈）可从 `/docs/design` 进入；Common Props 可打开
3. 顶栏「主题」指向交互页；旧 `/docs/theme-editor` 重定向；页脚含 Agents

## 相关文档

- [ai-composition-roadmap.md](./ai-composition-roadmap.md) — MCP / skill 组合路线（并行，不冲突）
- [ui-development.zh-CN.md](./ui-development.zh-CN.md) — 组件变更同步清单
- [design-kit/DESIGN.md](../design-kit/DESIGN.md) — 设计系统证据（Phase 2 可外化到文档站）
