# Development guide

[English](./DEVELOPMENT.md) · [中文](./DEVELOPMENT.zh-CN.md)

Internal documentation for contributors. Public overview: [root README](../README.md).

## Layout

| Path | Role |
| --- | --- |
| `src/` | Library source (components, theme, locale, styles) |
| `playground/` | Docs site (Vite + Markdown preview) |
| `scripts/` | Release & CHANGELOG tooling |
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
pnpm release      # full release (CHANGELOG, bump, publish, tag)
pnpm release:npm  # build + npm publish only (set version first)
pnpm release:git  # create tag / release branch only
```

## Related docs

| Doc | Topic |
| --- | --- |
| [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) | Conventional Commits + husky / commitlint |
| [UI development](./ui-development.md) | Build, publish, changelog |
| [scripts/README.md](../scripts/README.md) | Interactive release tooling |
| [AGENTS.md](../AGENTS.md) | Agent / Skills rules |
