# UI package development

[English](./ui-development.md) · [中文](./ui-development.zh-CN.md)

Maintainer notes for `@well-insight/ui` (build, docs playground, publish). External consumers should use the [root README](../README.md). Contributor setup: [DEVELOPMENT.md](./DEVELOPMENT.md).

## Build

```bash
pnpm build
```

Output is under `dist/` (`index.js`, `index.d.ts`, `styles.css`).

## Docs site

```bash
pnpm dev          # http://localhost:5182
pnpm build:docs
pnpm preview
```

Component pages: `src/components/*/docs/index.md` and `index.en.md`. Changelog pages read root `CHANGELOG.md` / `CHANGELOG.en.md`.

## Publish to npm only

Does not write CHANGELOG or create git tags. Bump root `package.json` `version` first:

```bash
pnpm release:npm
```

Equivalent to `build` + `pnpm publish --access public --no-git-checks`.

## Full release

Run step-by-step or use the orchestrator. See [scripts/README.md](../scripts/README.md). By default this publishes both `@well-insight/ui` and `@well-insight/ui-mcp`:

```bash
pnpm release:prepare -- --dry-run   # preview
pnpm release:prepare                # write version & CHANGELOG (syncs MCP version)
pnpm release:build                  # UI + MCP
pnpm release:commit                 # commit release files
# … branch / publish / tag / push

pnpm release                        # run all steps (includes MCP)
pnpm release -- --no-push           # local release, no push
pnpm release -- --no-mcp            # UI only
```

Before publishing, verify:

1. `version` matches CHANGELOG
2. `build`, `typecheck`, and `test` pass
3. `files` includes `dist` and `CHANGELOG.md`
4. peer dependency: `vue`

## MCP package

`@well-insight/ui-mcp` is an optional stdio server for clients that support [MCP](https://modelcontextprotocol.io/) (it does not replace installing `@well-insight/ui`). Public docs: docs site [MCP](/docs/mcp). Implementation: [packages/ui-mcp/README.md](../packages/ui-mcp/README.md).

The full UI release already includes MCP. Use these only to republish MCP alone:

```bash
pnpm mcp:build
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
