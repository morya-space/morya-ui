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

Interactive CHANGELOG selection, bump, tag / branch:

```bash
pnpm release -- --dry-run
pnpm release
```

Details: [scripts/README.md](../scripts/README.md).

Before publishing, verify:

1. `version` matches CHANGELOG
2. `build`, `typecheck`, and `test` pass
3. `files` includes `dist` and `CHANGELOG.md`
4. peer dependency: `vue`
