# UI package development

[English](./ui-development.md) · [中文](./ui-development.zh-CN.md)

Maintainer notes for `morya-ui` (build, docs playground, publish). External consumers should use the [root README](../README.md). Contributor setup: [DEVELOPMENT.md](./DEVELOPMENT.md).

## Build

```bash
pnpm build
```

Output is under `dist/` (`index.js`, `index.d.ts`, `styles.css`, `resolver.js`, plus per-component kebab-case subpaths such as `button/index.js`). Subpath entries such as `morya-ui/button` include JS, dependencies, and styles.

The `pnpm build` pipeline runs:

1. `scripts/prepare-on-demand.mjs` — generate per-component `style.ts` and inject style side-effects in `index.ts`
2. `scripts/generate-exports.mjs` — sync `package.json` `exports` / `sideEffects` and `src/resolver-map.ts`
3. `vite build` — full entry + `resolver`
4. `vite build --mode on-demand` — per-component chunks
5. `scripts/emit-style-entries.mjs` — emit `dist/<slug>/style.js` and `style.css`

Component styles live in `src/components/<Name>/styles.css` and are aggregated by `src/styles/index.css`. Theme tokens stay in `src/theme/styles.css`.

### Full vs on-demand (build)

- Full entry (`src/index.ts` → `dist/index.js`): re-exports `.vue` files directly, not component `index.ts`, so on-demand style side-effects stay out of the main bundle; pair with `morya-ui/styles.css`.
- On-demand entries (`src/components/<Name>/index.ts` → `dist/<slug>/index.js`): separate chunks with `import './style'`, including theme, base, and dependency CSS.

Both outputs are produced in one `pnpm build` and do not conflict.

## Docs site

```bash
pnpm dev          # http://localhost:5182
pnpm build:docs
pnpm preview
```

Component pages: `src/components/*/docs/index.md` and `index.en.md`. Changelog pages read root `CHANGELOG.md` / `CHANGELOG.en.md`. Public guide pages live under `playground/src/docs/guide/` (introduction, quick start, theme, …). Keep contributor-only conventions in this `docs/` folder, not in the public docs sidebar.

### Component folder

Keep each public component in this shape:

```text
src/components/Button/
├── Button.vue
├── types.ts
├── index.ts
├── Button.test.ts
└── docs/
    ├── index.md
    ├── index.en.md
    └── demos/           # interactive SFCs; zh/en md reference via src=
        └── Basic.vue
```

- Prefix: `M*` exports, `.m-*` CSS classes.
- Types: Props / Emits in `types.ts`, re-exported from the package entry.
- Tests: behavior-oriented Vitest + Vue Test Utils.

### Writing component docs

Frontmatter on `docs/index.md` / `docs/index.en.md`:

```md
---
title: Button
category: 01 / PRIMITIVE
description: A button that triggers an action
---
```

Body in Markdown. Put demos in `docs/demos/*.vue` and reference them:

````md
```vue preview src="./demos/Basic.vue"
```
````

Prefer UnoCSS utilities for demo layout. Keep `category` identical across locales (English falls back to Chinese). Numeric prefixes control sidebar order (`00 / GUIDE`, `01 / PRIMITIVE`, …).

Attrs / `pt` fallthrough rules: public [Styling & attrs](https://morya-space.github.io/morya-ui/docs/attrs). When documenting:

- PascalCase names in Props / Events tables link to the doc Types section or [API types](https://morya-space.github.io/morya-ui/docs/types); run `pnpm docs:sync-type-sections` to backfill from `types.ts`.
- List `pt` and DOM part keys when present.
- For fields: events on the native control, other fallthrough on the field root; prefer props for `placeholder` / `name`.

## Component change sync checklist

When public API, behavior, or docs change, update the related files below. Component pages under `docs/` are the written API; regenerate the MCP catalog with `pnpm mcp:generate` (you usually won’t edit `packages/ui-mcp/data/catalog.json` directly).

### Usual

| Item | Notes |
| --- | --- |
| `docs/index.md` + `docs/index.en.md` (and demos) | Keep Props / Events / Slots / examples in sync with the code |
| Behavior tests | `*.test.ts`; add or update when behavior changes |
| `pnpm typecheck` / relevant `pnpm test` | Run locally |

### By change

| Change | Sync |
| --- | --- |
| New public component | Component folder (see above); export from `src/index.ts` (component + types); `@import` its `styles.css` in `src/styles/index.css`; zh/en docs + demos + tests; then `pnpm build` (updates exports / on-demand entries; `package.json` exports and `resolver-map.ts` are script-maintained) |
| Props / Events / Slots / Methods | Update bilingual docs tables; run `pnpm docs:sync-type-sections` when useful; put shared type names in `playground/src/docs/guide/types.md` and `types.en.md` |
| Styles / new `--m-*` tokens | Component `styles.css`; run `pnpm tokens:generate` if tokens were added |
| Locale strings | `src/locale` and call sites |
| Component or guide Markdown | `pnpm mcp:generate`, then `pnpm mcp:check-catalog` / `pnpm mcp:validate-catalog` (optional `pnpm mcp:audit-examples`) |
| Selection / scenario hints | Edit `design-kit/` (e.g. `morya-ui-pages` `component-index.md`, `DESIGN.md`, golden pages), then `pnpm setup:sync-template` (overwrites `packages/setup/template/`) |
| MCP recommend / decision copy | Edit `packages/ui-mcp/src/patterns.ts`, `decisions.ts`, etc. (ships with the MCP package) |
| Release | Use `pnpm release*`; CHANGELOG is written by the release flow |

### After docs change

```bash
pnpm mcp:generate
pnpm mcp:check-catalog
pnpm mcp:validate-catalog
# If design-kit changed:
pnpm setup:sync-template
```

Code-only fixes with unchanged docs do not need a catalog regenerate. `design-kit/`-only edits skip `mcp:generate` but still need `setup:sync-template`.

### Overlay and icon conventions

Overlays Teleport to `body` by default (`teleport` / `appendTo`; `'self'` in place). Motion: `m-fade`, `m-scale-fade`, `m-slide-fade`, `m-message-slide`. Global mount via ConfigProvider `appendTo`.

- System icons: `MIcon` + `name`.
- Product icons: pass from the app; no need to ship a full SVG set in the library.

## Publish to npm only

Does not write CHANGELOG or create git tags. Bump root `package.json` `version` first:

```bash
pnpm release:npm
```

Equivalent to `build` + `pnpm publish --access public --no-git-checks`.

## Full release

Run step-by-step or use the orchestrator. See [scripts/README.md](../scripts/README.md). By default this publishes both `morya-ui` and `@morya-ui/mcp`:

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

`@morya-ui/mcp` is an optional stdio server for clients that support [MCP](https://modelcontextprotocol.io/) (it does not replace installing `morya-ui`). Public docs: docs site [MCP](/docs/mcp). Implementation: [packages/ui-mcp/README.md](../packages/ui-mcp/README.md).

The full UI release already includes MCP. Use these only to republish MCP alone:

```bash
pnpm mcp:build
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
