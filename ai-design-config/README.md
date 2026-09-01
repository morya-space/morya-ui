# Well Insight AI 设计配置

面向 **基于 `@well-insight/ui` 用 AI 生成业务页面** 的可复制配置包。将本目录内容合并到业务项目根目录（或按需选取子目录）即可。

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `DESIGN.md` | AI 第一信源：设计原则、布局、令牌、禁止项 |
| `design-tokens/` | 机器可读 token + CSS 变量（与组件库 `--wi-*` 对齐） |
| `docs/components.md` | 组件清单与场景选型（替代零散 Skills） |
| `docs/golden-pages/` | 黄金样例页面（列表 / 表单 / 仪表盘） |
| `src/examples/` | 与 golden-pages 对应的可运行参考（供 `@` 引用） |
| `scripts/check-raw-colors.mjs` | CI / 本地裸色值扫描 |
| `.cursor/rules/` | Cursor 规则（设计系统、组件用法、页面布局、编码风格） |

## 接入步骤

1. **安装组件库**

   ```bash
   pnpm add @well-insight/ui
   ```

2. **引入全局样式**（`main.ts`）

   ```ts
   import '@well-insight/ui/styles.css'
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

## 与组件库的关系

- **Token 单一事实源**：运行时以 `@well-insight/ui` 的 `styles.css` 为准；本目录 `design-tokens/` 供 AI 与静态检查使用，发版后如有差异以 npm 包为准。
- **组件 API**：以文档站 `/components` 或 MCP `@well-insight/ui-mcp` 为准；`docs/components.md` 仅作索引与场景指引。

## 可选：MCP 文档检索

```bash
npx -y @well-insight/ui-mcp
```

在 Cursor / 其他 MCP 客户端配置后，生成代码时可检索真实 Props / Events。
