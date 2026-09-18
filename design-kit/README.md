# Morya UI AI 设计配置

面向 **基于 `morya-ui` 用 AI 生成业务页面** 的可复制配置包。

## 推荐：一键接入

在业务项目根目录执行：

```bash
npx @morya-ui/setup
```

会安装 `morya-ui`、复制本目录中的 skill / rules / `DESIGN.md` 等、写入 Cursor MCP（`@morya-ui/mcp`），并尽量在入口注入样式。

已安装组件库时，可只写入本配置与 MCP：

```bash
npx @morya-ui/setup ai
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
| `DESIGN.md` | AI 第一信源：设计原则、布局、令牌、禁止项 |
| `design-tokens/` | 机器可读 token + CSS 变量（与组件库 `--m-*` 对齐） |
| `docs/components.md` | 组件清单与场景选型（替代零散 Skills） |
| `docs/golden-pages/` | 黄金样例（列表 / 表单 / 仪表盘 / 登录 / 落地 / 空状态） |
| `src/examples/` | 与 golden-pages 对应的可运行参考（供 `@` 引用） |
| `scripts/check-raw-colors.mjs` | CI / 本地裸色值扫描 |
| `.cursor/rules/` | Cursor 规则（设计系统、组件用法、页面布局、编码风格） |
| `.agents/skills/morya-ui-pages/` | 消费方 Agent Skill：Ops / 账户 / 流程 / 系统 / 营销等全场景；可与 rules 并存 |

## 手动接入步骤

1. **安装组件库**

   ```bash
   pnpm add morya-ui
   ```

2. **引入全局样式**（`main.ts`）

   ```ts
   import 'morya-ui/styles.css'
   ```

3. **复制本配置包**到业务项目根目录（合并 `.cursor/rules`，勿覆盖已有规则时可改文件名前缀）。

4. **（推荐）** 在业务项目 `package.json` 增加检查脚本：

   ```json
   {
     "scripts": {
       "check:colors": "node scripts/check-raw-colors.mjs"
     }
   }
   ```

5. 生成页面前让 AI 先读 `DESIGN.md`，再读对应 `docs/golden-pages/*.vue` 与 `docs/components.md`。

6. **（推荐）** 若客户端支持 Agent Skills，保留 `.agents/skills/morya-ui-pages/`。说明见文档站 [Agent Skill](https://morya-space.github.io/morya-ui/docs/agent-skill)；与 `.cursor/rules` 互补（rules 偏编辑器常驻，skill 偏按需工作流）。

## 与组件库的关系

- **Token 单一事实源**：运行时以 `morya-ui` 的 `styles.css` 为准；本目录 `design-tokens/` 供 AI 与静态检查使用，发版后如有差异以 npm 包为准。
- **组件 API**：以文档站 `/components` 或 MCP `@morya-ui/mcp` 为准；`docs/components.md` 仅作索引与场景指引。

## 可选：MCP 文档检索

```bash
npx -y @morya-ui/mcp
```

在 Cursor / 其他 MCP 客户端配置后，生成代码时可检索真实 Props / Events。使用 `@morya-ui/setup` 时会自动写入 Cursor 的 `.cursor/mcp.json`。
