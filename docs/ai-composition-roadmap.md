# AI 消费体系未来计划（Composition-first）

> 状态：**待办 / 非当前迭代**  
> 受众：维护者  
> 背景：已完成「黄金页降级 → 组合优先」与 `MPageFilters` 展开/收起布局优化；本文记录后续可落地的方向，按需开 issue 执行。

## 目标

把 morya-ui 继续做成 **「可被 agent 正确消费的设计系统」**：

- 默认路径：surface → L2 决策 + page snippets → craft → `validate_*`
- 黄金页：可选块顺序基准，不扩新 craft 变体
- 投入重心：**组合质量 + 校验闭环**，不是再堆整页样例

## 原则

| 做 | 不做 |
| --- | --- |
| 补高复用 L2 组合（snippet + decision） | 新建第三套 compositions catalog |
| CI 防 snippet / golden / decision 漂移 | 继续增加 `list-page-*` 黄金变体 |
| Skill 瘦身，细则走 MCP | 引入命名风格 preset 目录 |
| Evals 可机检 | 过早做万能落地页生成器 |

## 建议迭代顺序

### P0 — 防漂移（优先）

#### 1. CI：引用完整性

- **做什么**：校验 `patterns.suggestedSnippets`、`decisions.relatedSnippets`、`designRules.snippets` 中的 id 均存在于 `page-snippets.ts`
- **落点**：`packages/ui-mcp` 脚本 + CI；可挂在 `pnpm --filter @morya-ui/mcp test` 或独立 `check:snippets`
- **完成标准**：缺 id 则失败；单测覆盖至少一个故意错误用例

#### 2. CI：golden / 关键 snippet 跑 `validate_usage`

- **做什么**：对 `list-page*`、`form-in-dialog`、`list-filters-stack` 等源码自动 `validate_usage`（及必要的 `validate_page`）
- **落点**：`packages/ui-mcp` 测试或 `scripts/`；黄金页源以 `design-kit/docs/golden-pages` 为准
- **完成标准**：未知 prop/event 阻断；与组件 API 变更同 PR 修样例

### P1 — 默认路径更聪明

#### 3. `recommend_page` 按 features 动态拼装

- **已有**：admin-list + dense → `list-filters-dense`
- **扩展**：
  - 含删除 / destructive → 加入 `confirm-delete`
  - 短新建/编辑 → 加入 `form-in-dialog`（或 drawer）
  - 向导 / 分步 → 加入 `wizard-steps`
- **落点**：[`packages/ui-mcp/src/tools.ts`](../packages/ui-mcp/src/tools.ts) `recommendPage`
- **完成标准**：单测覆盖 dense / delete / dialog 三类建议差异

### P2 — L2 组合补齐

#### 4. 三个高频组合（可拆多个 PR）

| Snippet / 强化 | 用途 |
| --- | --- |
| `list-row-delete`（或加固现有 `confirm-delete` + row actions） | 行删除 + ConfirmDialog + `message.success` |
| `settings-tabs-form` | `MTabs` + `MPageSection` form/actions |
| `table-fill-choice`（snippet 或 decision） | 何时 `MPageContent fill` + `MTable fill paginator` |

同步：`relatedSnippets`、`suggestedSnippets`、page-layouts、evals。

### P3 — Skill 瘦身

#### 5. `morya-ui-pages` Skill 瘦身 v1

- **做什么**：[`SKILL.md`](../design-kit/.agents/skills/morya-ui-pages/SKILL.md) 只保留 surface map、6 步工作流、硬边界；细则改为「查 MCP / references」
- **evals**：至少 3 条改为可机检期望（必须命中的 snippet id / 必须 `validate_usage`）
- **同步**：`pnpm` setup template sync（`packages/setup/scripts/sync-template.mjs`）

## 明确不做（本路线图周期内）

- 新开 `list-page-*` craft 黄金页
- 命名视觉 preset catalog
- 第三套 compositions 数据源（继续强化 `page-snippets` + `decisions`）
- 批量重写全部黄金页 Vue（按需对齐组件 API 即可）

## 相关现状（已完成，勿重复开）

- Composition-first：skill / MCP `nextStep` / `suggestedSnippets` / `relatedSnippets`
- 筛选组合：`list-filters-stack` / dense / collapsible / chips
- `MPageFilters`：`#actions` 尾部簇、高级筛选/收起 + chevron

## 开 issue 时建议标题

```text
ci(mcp): assert snippet id references resolve
ci(mcp): validate_usage on golden pages and key snippets
feat(mcp): recommend_page feature-aware suggestedSnippets
feat(mcp): add settings-tabs-form / table-fill-choice snippets
docs(skill): slim morya-ui-pages SKILL.md composition-first
```

## 维护说明

- 执行某条时：从本文勾选或移到对应 PR，完成后在此标注日期与 PR 链接
- 内容变更后记得：`generate:recipes` + `sync-template`（若触及 design-kit skill）
