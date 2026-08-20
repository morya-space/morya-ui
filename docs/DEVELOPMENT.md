# Development guide

[English](./DEVELOPMENT.md) · [中文](./DEVELOPMENT.zh-CN.md)

Internal documentation for contributors. Public overview: [root README](../README.md).

## Layout

| Path | Role |
| --- | --- |
| `src/` | Library source (components, theme, locale, styles) |
| `playground/` | Docs site (Vite + Markdown preview) |
| `scripts/` | Release & CHANGELOG tooling |
| `packages/ui-mcp/` | `@well-insight/ui-mcp` stdio MCP server |
| `docs/` | Maintainer docs |
| `dist/` | Build output (do not edit by hand) |

## Commands

```bash
pnpm install
pnpm dev          # docs playground → http://localhost:5182
pnpm build        # library → dist/
pnpm build:docs
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm release              # full pipeline (prepare → build → commit → … → push; includes MCP)
pnpm release:prepare      # write version & CHANGELOG; sync MCP version
pnpm release:build        # build UI + MCP
pnpm release:commit       # commit UI / MCP release files
pnpm release:branch       # create release/{version} branch
pnpm release:publish      # publish UI + MCP
pnpm release:tag          # create v{version} tag
pnpm release:push         # push branches & tag
pnpm release:npm          # build + publish only (UI + MCP; set version first)
pnpm release:git          # create tag / release branch only
pnpm release:mcp          # MCP-only publish (usually unnecessary; full release includes it)
pnpm mcp:build            # build @well-insight/ui-mcp (catalog + stdio server)
pnpm mcp:start            # run MCP locally (stdio)
```

## Related docs

| Doc | Topic |
| --- | --- |
| [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) | Conventional Commits + husky / commitlint |
| [UI development](./ui-development.md) | Build, publish, changelog |
| [scripts/README.md](../scripts/README.md) | Interactive release tooling |
| [packages/ui-mcp/README.md](../packages/ui-mcp/README.md) | UI MCP server |
| [AGENTS.md](../AGENTS.md) | Agent / Skills rules |
