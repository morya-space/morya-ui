# UI 包开发

[English](./ui-development.md) · [中文](./ui-development.zh-CN.md)

`@well-insight/ui` 维护者说明（构建、文档站、发版）。外部引用方请看 [根 README（中文）](../README.zh-CN.md)；贡献环境见 [DEVELOPMENT.zh-CN.md](./DEVELOPMENT.zh-CN.md)。

## 构建

```bash
pnpm build
```

产物在 `dist/`（`index.js`、`index.d.ts`、`styles.css`）。

## 文档站

```bash
pnpm dev          # http://localhost:5182
pnpm build:docs
pnpm preview
```

组件文档：`src/components/*/docs/index.md` 与 `index.en.md`。更新日志页读取根目录 `CHANGELOG.md` / `CHANGELOG.en.md`。

## 仅发布到 npm

不写 CHANGELOG、不打 tag；先改好 `version`：

```bash
pnpm release:npm
```

## 完整发版

分步执行或一键编排，详见 [scripts/README.md](../scripts/README.md)：

```bash
pnpm release:prepare -- --dry-run   # 预览
pnpm release:prepare                # 写版本与 CHANGELOG
pnpm release:commit                 # 提交 release 文件
# … branch / build / publish / tag / push

pnpm release                        # 一键跑完全部步骤
pnpm release -- --no-push           # 本地发版，不 push
```

发布前检查：`version` 与 CHANGELOG 一致；`build` / `typecheck` / `test` 通过；`files` 包含 `dist` 与 `CHANGELOG.md`；peer 为 `vue`。

## 可选：MCP 包

`@well-insight/ui-mcp` 为可选 stdio 服务，供支持 [MCP](https://modelcontextprotocol.io/) 的客户端检索文档（不替代安装 `@well-insight/ui`）。对外说明见文档站 [MCP](/docs/mcp)；实现见 [packages/ui-mcp/README.md](../packages/ui-mcp/README.md)。

```bash
pnpm mcp:build
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
