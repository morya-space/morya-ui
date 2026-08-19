# 项目 Skills 使用指南

本项目的所有项目级 Agent Skill 统一存放在：

```text
.agents/skills/<skill-name>/SKILL.md
```

每个 skill 是一组可按需加载的工作流说明，用于让 Agent 在特定任务中遵循更专业、更稳定的处理方式。skill 不等同于 npm 依赖，也不会直接参与前端构建。

本仓库为 `@well-insight/ui` 独立组件库，skills 已按组件库场景精简。

## 目录结构

```text
.agents/
└── skills/
    ├── vue3-component-library/
    │   └── SKILL.md
    ├── frontend-design/
    │   └── SKILL.md
    └── ...
```

一个 skill 目录除 `SKILL.md` 外，还可以包含：

- `references/`：参考资料
- `scripts/`：辅助脚本
- `assets/`：模板、图片或其他资源
- `agents/`：特定 Agent 的配置

## 使用步骤

### 1. 判断任务是否匹配某个 skill

| 任务 | 推荐 skill |
| --- | --- |
| 新增 / 重构可复用组件或组件库工程 | `vue3-component-library` |
| 单个组件 Props / Emits / Slots | `vue3-component-design` |
| 组件 / composable 单元测试 | `vue3-unit-testing` |
| 优化已有页面或文档站 UI | `frontend-design`、`improve-ui` |
| 主题、token、亮暗模式 | `theme-system` |
| 无障碍检查 | `fixing-accessibility` |
| 动画卡顿或滚动性能问题 | `fixing-motion-performance` |
| Vite 配置 / 构建问题 | `vite-docs` |
| 测试本地文档站、截图、验证交互 | `webapp-testing` |
| 撰写维护者文档 / 规范 | `doc-coauthoring` |
| 新增或改进 skill | `skill-creator` |

如果你判断某个任务可能需要 skill，先询问用户是否要使用，再继续。除非用户明确指定，否则不要自行加载 skill。

### 2. 加载 skill

在支持 skill 自动发现的 Agent 环境中，项目启动后会从 `.agents/skills` 自动读取可用 skill。匹配任务时按需加载，不要一次性加载所有 skill。

也可以通过命令手动读取：

```bash
npx openskills read <skill-name>
```

一次加载多个 skill：

```bash
npx openskills read vue3-component-library,vue3-unit-testing
```

### 3. 按 skill 说明执行任务

skill 通常会规定适用场景、调查顺序、约束、验证命令和交付要求。项目通用规则仍以 `AGENTS.md` 为准；冲突时优先项目规则与用户要求。

### 4. 组合使用多个 skill

复杂任务可以组合多个 skill，但应保持最小必要范围。例如：

```text
新增公开组件并补测试：
1. vue3-component-library：工程与公共 API 约定
2. vue3-component-design：Props / Emits / Slots
3. vue3-unit-testing：行为与无障碍测试
```

## Skill 清单

| Skill | 作用和适用场景 |
| --- | --- |
| `create-design-md` | 从已有项目提取设计语言与 token，创建或更新 `DESIGN.md`；只读产品源代码。 |
| `doc-coauthoring` | 结构化共写文档、提案、技术说明。 |
| `fixing-accessibility` | 检查和修复无障碍问题（ARIA、键盘、焦点、对比度等）。 |
| `fixing-motion-performance` | 排查动画卡顿、布局抖动、滚动关联动画等性能问题。 |
| `frontend-design` | 创建或重塑有明确视觉方向的前端界面。 |
| `improve-ui` | 对现有界面做只读 UI 审计并输出可执行实现计划。 |
| `skill-creator` | 创建、修改、评估 skill。 |
| `theme-system` | 设计令牌与主题系统（亮暗、多主题、命名规范）。 |
| `ui-skills-root` | UI 相关任务入口，通过 ui-skills CLI 选择最小必要上下文。 |
| `vite-docs` | Vite 官方文档优先：配置、插件、构建与优化。 |
| `vue3-component-design` | Vue3 组件 API、v-model、Slots、样式隔离与无障碍。 |
| `vue3-component-library` | Vue3 组件库工程规范：token、主题、API、测试、文档与兼容性。 |
| `vue3-unit-testing` | Vitest + Vue Test Utils 组件 / composable 测试。 |
| `webapp-testing` | 用 Playwright 测试本地 Web 应用、截图与交互验证。 |

## 新增 Skill

1. 在 `.agents/skills/<skill-name>/` 下创建 `SKILL.md`。
2. 更新本文件的清单与常用映射。
3. 如从外部源同步（例如 ui-skills），同步更新 `skills-lock.json`。
4. 不要使用 `.claude/skills` 或其他并行 skill 目录。
