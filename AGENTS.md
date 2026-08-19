# AGENTS

## 项目级 Skills

本项目所有 Agent Skill 统一存放在：

```text
.agents/skills/<skill-name>/SKILL.md
```

完整的技能清单、作用、适用场景、加载步骤和新增规范见 [`SKILLS.md`](./SKILLS.md)。

本仓库为独立 Vue 3 组件库，仅保留与组件库相关的精简 skills（不含 Hono / 办公文档等）。

## 使用规则

1. 开始任务前，先判断是否存在匹配的 skill。
2. 除非用户明确指定要使用某个 skill，否则不要自行加载或调用 skill。
3. 如果你判断某个任务可能需要 skill，先向用户确认是否使用，再继续。
4. 支持自动发现的 Agent 会从 `.agents/skills` 读取项目级 skill。
5. 需要手动加载时，使用：

   ```bash
   npx openskills read <skill-name>
   ```

   多个 skill 可以使用逗号分隔：

   ```bash
   npx openskills read frontend-design,fixing-accessibility
   ```

6. 不要重复加载当前上下文中已经加载的 skill。
7. skill 中引用的 `references/`、`scripts/`、`assets/` 等路径，均相对于对应 skill 目录解析。
8. 项目规则、用户明确要求和安全约束优先于 skill 中的通用建议。
9. 新增或修改 skill 时，只允许使用 `.agents/skills`，不要再创建 `.claude/skills` 或其他项目级 skill 目录。

## 常用选择

- Vue3 组件库工程：`vue3-component-library`
- 单个组件 API / 设计：`vue3-component-design`
- Vue3 单元测试：`vue3-unit-testing`
- 页面视觉设计：`frontend-design`
- 主题与设计令牌：`theme-system`
- 现有界面只读审计：`improve-ui`
- 无障碍：`fixing-accessibility`
- 动画性能：`fixing-motion-performance`
- Vite 相关：`vite-docs`
- 本地 Web 测试：`webapp-testing`
- 文档共写：`doc-coauthoring`
- Skill 开发：`skill-creator`

## 代码与验证

- 修改代码前先读取相关文件和上下文。
- 优先进行最小范围、根因导向的修改。
- 修改后运行与变更最相关的诊断、Lint、测试或构建命令（如 `pnpm test`、`pnpm typecheck`、`pnpm build`）。
- 搜索、读取或检查项目文件时，默认排除 `node_modules`、`dist`、`coverage` 等依赖与产物目录，除非用户明确要求检查其内容。
- 不要覆盖或回退用户未要求处理的现有改动。
- 不要提交 Git commit，除非用户明确要求。
