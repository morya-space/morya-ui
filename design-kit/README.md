# Morya UI AI 设计配置

面向 **基于 `morya-ui` 用 AI 生成业务页面** 的可复制配置包。

## 推荐：一键接入

在业务项目根目录执行：

```bash
npx @morya-ui/setup
```

会安装 `morya-ui`、复制本目录中的 `morya-ui-pages` / rules / `DESIGN.md` / `AGENTS.md` 等、按需用 skills CLI 安装最新 companion skills、写入 **Cursor / VS Code / Zed** MCP（及便携 `.mcp.json`），并尽量在入口注入样式。

已安装组件库时，可只写入本配置与 MCP：

```bash
npx @morya-ui/setup ai
npx @morya-ui/setup ai --skills=all   # 含最新 companion skills（skills CLI）
npx @morya-ui/setup ai --editors=cursor,vscode
```

完整说明（flags、冲突策略）：

- 文档站：[一键接入](https://morya-space.github.io/morya-ui/docs/setup)
- AI 流程：[AI 接入](https://morya-space.github.io/morya-ui/docs/ai-setup)
- Skill 说明：[Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill)
- 包 README：[`packages/setup/README.md`](../packages/setup/README.md)

手动合并本目录亦可（见下方步骤）。

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `DESIGN.md` | AI 第一信源：原则、应用根、令牌摘要、禁止项（页面结构见 skill） |
| `AGENTS.md` | 编辑器无关的常驻清单（VS Code / Zed / CLI 等可读；与 Cursor rules 互补） |
| `docs/golden-pages/` | MCP 黄金样例源（不复制到业务项目） |
| `scripts/check-raw-colors.mjs` | CI / 本地裸色值扫描 |
| `.cursor/rules/` | Cursor 规则（设计系统、组件用法、页面布局、编码风格） |
| `.agents/skills/morya-ui-pages/` | 必选：Ops / 账户 / 流程 / 系统 / 营销等；可与 rules 并存（多数编辑器可读） |
| （setup 可选）`frontend-design` / `fixing-accessibility` / `impeccable` | 不在本目录 vendoring；由 setup 通过 skills CLI 安装最新版 |

### 分层：什么可移植、什么按编辑器

| 层 | 路径 | 可移植性 |
| --- | --- | --- |
| Skills | `.agents/skills/` | 高（Agent Skills 开放标准；Cursor / VS Code Copilot 等） |
| Design contract | `DESIGN.md` + `AGENTS.md` | 高 |
| Cursor rules | `.cursor/rules/*.mdc` | 仅 Cursor |
| MCP wiring | setup 写入各编辑器配置 | 路径/键名因编辑器而异；协议本身通用 |

## 手动接入步骤

1. **安装组件库**

   ```bash
   pnpm add morya-ui
   ```

2. **引入全局样式**（`main.ts`）

   ```ts
   import 'morya-ui/styles.css'
   ```

3. **复制本配置包**到业务项目根目录（合并 `.cursor/rules`，勿覆盖已有规则时可改文件名前缀；保留 `AGENTS.md` 供非 Cursor 编辑器）。

4. **（推荐）** 在业务项目 `package.json` 增加检查脚本：

   ```json
   {
     "scripts": {
       "check:colors": "node scripts/check-raw-colors.mjs"
     }
   }
   ```

5. 生成页面前让 AI 先读 `DESIGN.md`（及 `AGENTS.md`）；有参考时用 MCP `map_reference` / `get_page_snippet`。

6. **（推荐）** 若客户端支持 Agent Skills，至少保留 `.agents/skills/morya-ui-pages/`；可选 companion 见 setup `--skills`。说明见文档站 [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill)；与 `.cursor/rules` 互补（rules 偏 Cursor 常驻，skill / `AGENTS.md` 偏跨编辑器）。

## 与组件库的关系

- **Token 单一事实源**：运行时以 `morya-ui` 的 `styles.css` 为准；Agent 查令牌用 MCP `get_design_rules`。
- **组件 API**：以文档站 `/components` 或 MCP `@morya-ui/mcp` 为准。

## 可选：MCP 文档检索

```bash
npx -y @morya-ui/mcp
```

在 Cursor / VS Code / Zed / 其他 MCP 客户端配置后，生成代码时可检索真实 Props / Events。使用 `@morya-ui/setup` 时会按编辑器写入：

| 编辑器 | 路径 | JSON 键 |
| --- | --- | --- |
| Cursor | `.cursor/mcp.json` | `mcpServers` |
| VS Code | `.vscode/mcp.json` | `servers` |
| Zed | `.zed/settings.json` | `context_servers` |
| 便携 | `.mcp.json` | `mcpServers` |
