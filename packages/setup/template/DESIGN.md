# Morya UI 设计系统（AI 第一信源）

> 生成或审查使用 `morya-ui` 的界面时，**必须先遵守本文**。  
> 本文只写与页面类型无关的契约。某一类页面怎么拼、用哪个组件，见 `morya-ui-pages` skill 与 MCP，不要从本文推断出唯一布局。

## 1. 设计原则

1. **组件优先**：交互与布局使用库内 `M*`，不手写等价 DOM。
2. **令牌优先**：颜色、间距、圆角、阴影、动效使用 `--m-*`；禁止裸 `#hex` / `rgb()`（`scripts/check-raw-colors.mjs` 可扫描）。
3. **语义一致**：主操作 `severity="primary"`；破坏性操作用 `severity="danger"` 或确认。
4. **可访问性**：控件有可访问名称；仅图标的按钮带 `aria-label`；浮层可键盘关闭。
5. **单一事实源**：组件 API 以 MCP / 文档为准，禁止臆造 prop、event、slot。

## 2. 应用根

- 入口引入 `morya-ui/styles.css`（或按需子路径样式）。
- 应用根使用 `MConfigProvider`，统一 locale、主题、密度与浮层挂载。
- 外壳随场景选择，不要把侧栏后台当成所有页面的默认结构。

## 3. 设计令牌（摘要）

完整定义见 MCP `get_design_rules`。运行时以已安装的 `morya-ui/styles.css` 为准。

| 用途 | 变量 |
| --- | --- |
| 页面背景 | `--m-color-surface` |
| 正文 | `--m-color-text` |
| 次要文字 | `--m-color-text-muted` |
| 边框 | `--m-color-border` |
| 品牌 / 链接 | `--m-color-primary` |
| 错误 | `--m-color-danger` |
| 区块间距 | `--m-space-4` / `--m-space-6` |
| 圆角 / 阴影 | `--m-radius-md` / `--m-shadow-md` |
| 动效时长 | `--m-motion-fast/normal/enter/exit` |
| 进出场位移 / 缓动 | `--m-motion-distance` / `--m-motion-ease` |

动效强度用 `useMotion`（`data-m-motion`：`full` / `reduced` / `none`），不跟随系统 `prefers-reduced-motion`；进出场预设用 `motion.transitions` / 组件 `transition`（见文档站「动效」）。

## 4. 禁止项

- 禁止同一界面混用第二套 UI 库。
- 禁止业务 CSS 写死主题色；暗色须能随 `[data-theme="dark"]` 生效。
- 禁止用不可聚焦的容器冒充按钮。
- 禁止跳过样式入口。
- 禁止把某一类页面的配方写成所有页面的默认结构。

## 5. AI 工作流

1. 读本文，确认契约。
2. 加载 `morya-ui-pages`，由 skill 选定表面与布局；可选 companion 只补充视觉或无障碍，冲突时本文 + skill + MCP 优先。
3. 用 MCP 查真实 API 与样例后再写代码。
4. 完成后可运行 `pnpm check:colors`（若已配置）。

## 6. 相关资源

- 包：`morya-ui` · 样式：`morya-ui/styles.css`
- 页面配方：`.agents/skills/morya-ui-pages/`（及 setup 时勾选的 companion）
- 主题 API：`useTheme` / `useDensity` / `useMotion`
- 动效预设：`createMoryaUI({ motion })`、`componentDefaults.*.transition`、浮层 `transition` prop；详情见文档 `/docs/motion`
