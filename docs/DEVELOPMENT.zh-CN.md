# 开发指南

[English](./DEVELOPMENT.md) · [中文](./DEVELOPMENT.zh-CN.md)

本仓库贡献者用的对内文档。对外产品说明见 [根 README（中文）](../README.zh-CN.md)。

## 仓库结构

| 路径 | 作用 |
| --- | --- |
| `src/` | 组件库源码（组件、主题、locale、样式） |
| `playground/` | 文档站（Vite + Markdown 预览） |
| `scripts/` | 发版与 CHANGELOG 工具 |
| `packages/ui-mcp/` | `@well-insight/ui-mcp` stdio MCP 服务 |
| `docs/` | 维护者文档 |
| `dist/` | 构建产物（勿手改） |

## 常用命令

```bash
pnpm install
pnpm dev          # 文档站 → http://localhost:5182
pnpm build        # 组件库 → dist/
pnpm build:docs
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm release              # 一键发版（prepare → build → commit → … → push；含 MCP）
pnpm release:prepare      # 写版本与 CHANGELOG，并同步 MCP 版本
pnpm release:build        # 构建 UI + MCP
pnpm release:commit       # 提交 UI / MCP release 文件
pnpm release:branch       # 创建 release/{version} 分支
pnpm release:publish      # 发布 UI + MCP
pnpm release:tag          # 打 v{version} 标签
pnpm release:push         # 推送分支与 tag
pnpm release:npm          # 仅 build + publish（UI + MCP；需先改 version）
pnpm release:git          # 仅补 tag / release 分支
pnpm release:mcp          # 单独发布 MCP（一般不必；完整发版已包含）
pnpm mcp:build            # 构建 @well-insight/ui-mcp（文档目录 + stdio 服务）
pnpm mcp:start            # 本地启动 MCP（stdio）
```

## 相关文档

| 文档 | 内容 |
| --- | --- |
| [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) | 提交规范 |
| [UI 开发](./ui-development.zh-CN.md) | 构建与发版 |
| [scripts/README.md](../scripts/README.md) | 发版脚本说明 |
| [packages/ui-mcp/README.md](../packages/ui-mcp/README.md) | UI MCP 服务 |
| [AGENTS.md](../AGENTS.md) | Agent / Skills 使用规则 |
