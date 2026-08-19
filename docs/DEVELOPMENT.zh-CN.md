# 开发指南

[English](./DEVELOPMENT.md) · [中文](./DEVELOPMENT.zh-CN.md)

本仓库贡献者用的对内文档。对外产品说明见 [根 README（中文）](../README.zh-CN.md)。

## 仓库结构

| 路径 | 作用 |
| --- | --- |
| `src/` | 组件库源码（组件、主题、locale、样式） |
| `playground/` | 文档站（Vite + Markdown 预览） |
| `scripts/` | 发版与 CHANGELOG 工具 |
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
pnpm release      # 完整发版（CHANGELOG、bump、publish、tag）
pnpm release:npm  # 仅 build + npm publish（需先改 version）
pnpm release:git  # 仅补 tag / release 分支
```

## 相关文档

| 文档 | 内容 |
| --- | --- |
| [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) | 提交规范 |
| [UI 开发](./ui-development.zh-CN.md) | 构建与发版 |
| [scripts/README.md](../scripts/README.md) | 发版脚本说明 |
| [AGENTS.md](../AGENTS.md) | Agent / Skills 使用规则 |
