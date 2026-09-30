# 文档站信息架构重梳

> 状态：Stage 2 落地完成，待 Reader Testing  
> 决策来源：完整重梳（结构 + 去重 + Recipes/学习路径）；Blog/Agent 顶栏保持现状；中英同步；边确认边改代码。

## 成功标准

- 新人 5 分钟内找到快速上手
- 设计内容不再淹没在扁平列表里
- Recipes 可直接照做
- 侧栏一眼能分组

## 受众优先级

应用开发者 > 主题/设计定制者 > Agent / AI 使用者

## 顶栏（已确认）

`首页 | 文档 | 组件 | 设计 | 更新日志`

- 「设计」→ `/docs/design`，**独立侧栏**：只列「设计语言」组，与文档菜单拆开（不再共用一份侧栏）
- 「主题编辑器」不占顶栏，放入文档「主题与定制」组（外链 `/theme-editor`）
- Blog 不进站；Agent 不单独占顶栏，仍在文档侧栏分组

## 侧栏分组（草案）

### 开始

| slug            | 说明                  |
| --------------- | --------------------- |
| `introduction`  | 介绍 + 学习路径摘要   |
| `learning-path` | **新增** 完整学习路径 |
| `quick-start`   | 快速上手              |
| `setup`         | 一键接入              |
| `ssr`           | SSR                   |

### 主题与定制

| slug            | 说明                                     |
| --------------- | ---------------------------------------- |
| `theme`         | 主题 API（合并说明令牌入口）             |
| `motion`        | 动效 API（吸收 design-motion 设计原则）  |
| `design-tokens` | 令牌完整目录                             |
| `theme-editor`  | **导航项** → `/theme-editor`（非 md 页） |

### 设计语言

| slug                | 说明                                   |
| ------------------- | -------------------------------------- |
| `design`            | 设计语言入口                           |
| `design-color`      | 色彩                                   |
| `design-typography` | 字体                                   |
| `design-spacing`    | 间距                                   |
| `design-layout`     | 布局                                   |
| `design-feedback`   | 反馈层级                               |
| ~~`design-motion`~~ | **合并进 `motion`**，本页改为跳转/删除 |

### 配方（Recipes）— 新增

| slug                     | 说明                   |
| ------------------------ | ---------------------- |
| `recipe-form-login`      | 登录/简单表单          |
| `recipe-table-filter`    | 搜索 + 过滤 + 表格分页 |
| `recipe-confirm-flow`    | Dialog / Confirm 流程  |
| `recipe-admin-layout`    | 中后台 Layout          |
| `recipe-theme-customize` | 主题定制               |
| `recipe-ssr-nuxt`        | Nuxt SSR 最小接入      |

### 组件用法约定

| slug            | 说明         |
| --------------- | ------------ |
| `attrs`         | 样式与 attrs |
| `common-props`  | Common Props |
| `types`         | API 类型     |
| `config`        | 全局配置     |
| `accessibility` | 无障碍       |
| `conventions`   | 约定         |

### Agent / AI（侧栏保留，不进顶栏）

| slug          | 说明        |
| ------------- | ----------- |
| `for-agents`  | 面向 Agent  |
| `ai-setup`    | AI 接入     |
| `agent-skill` | Agent Skill |
| `mcp`         | MCP         |

## 合并决策

- `design-motion` → 原则并入 `motion`，原 slug 保留短暂 redirect 页或 301 式站内跳转文案
- `theme` 与 `design-tokens` 分页保留，互链强化
- 学习路径：介绍页摘要 + `/docs/learning-path` 详情
- **菜单拆分**：侧栏按 `section` 分为 `docs` / `design` 两套。文档菜单不再包含「设计语言」；设计页只显示「设计语言」组（单组时渲染为扁平列表）。`guideNav.ts` 的 `section` 字段 + `findGuideNavSectionId` / `listGuideNavGroups` 是唯一数据源，顶栏高亮与侧栏共用同一判断。

## 实现清单

- [x] guide 分组：改用 `guideNav.ts` 作为侧栏唯一数据源（未走 frontmatter `group`）
- [x] `loadGuideDocs` / DocsView 分组侧栏
- [x] SiteHeader 顶栏收敛
- [x] i18n 分组标题 + 新页面标题
- [x] 合并 design-motion → motion（中英）
- [x] 新增 learning-path（中英）
- [x] 新增 6 条 recipes（中英 + demos；`recipe-ssr-nuxt` 无实时预览）
- [x] 介绍页加学习路径摘要
- [x] 互链与旧 slug 兼容（`/docs/design-motion` → `docs/motion`）

## 章节起草进度

| 章节                | 状态   |
| ------------------- | ------ |
| 信息架构 / 导航骨架 | 完成   |
| 学习路径内容        | 完成   |
| Recipes 内容        | 完成   |
| 去重合并文案        | 完成   |
| Reader Testing      | 未开始 |

## 验证

- `pnpm build:docs:pages` → 142 SEO pages
- `pnpm check:docs-smoke` → ok
- `node --test scripts/docs-seo.test.mjs` → pass
- `npx vitest run` → 1074 pass（6 个 `node:test` 文件被 vitest 误收集，属既有问题）
- `playground/vite/docsManifestPlugin.test.ts` 已同步新 slug 列表
