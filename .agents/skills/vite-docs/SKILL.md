---
name: vite-docs
description: Vite 官方文档优先 skill。只要用户提到 Vite、vite.config、vite dev/build/preview、server/build/preview、插件、迁移、优化、部署、SSR、alias、base 或代理，就先拉取最新官方文档再回答；不要凭记忆回答。
---

# Vite Docs

Use this skill when the user asks about Vite or Vite-related configuration, APIs, migration, plugins, dev server, build, preview, dependency optimization, SSR, or deployment.

## Core rule

Always check the latest official Vite docs before answering. Prefer the Vite docs site as the source of truth, and only use the local project files after you know which Vite feature or option the user is working on.

Do not answer Vite config or API questions from memory when the docs may have changed.

## Workflow

1. Identify the Vite topic.
   - Config files: `vite.config.*`
   - Shared options: `base`, `root`, `resolve`, `plugins`, `publicDir`, `cacheDir`, `input`
   - Dev server: `server.*`
   - Build: `build.*`
   - Preview: `preview.*`
   - Dependency optimization: `optimizeDeps.*`
   - SSR, migration, performance, or deployment topics

2. Fetch the latest official docs.
   - Primary source: `https://vite.dev/`
   - Topic pages usually live under `https://vite.dev/config/` and `https://vite.dev/guide/`
   - If needed, cross-check the Vite repository docs at `https://github.com/vitejs/vite/tree/main/docs`
   - Prefer the most specific page for the topic first, then cross-check the config index if needed.
   - Useful pages often include:
     - `https://vite.dev/config/`
     - `https://vite.dev/config/shared-options`
     - `https://vite.dev/config/server-options`
     - `https://vite.dev/config/build-options`
     - `https://vite.dev/config/preview-options`
     - `https://vite.dev/config/dep-optimization-options`
     - `https://vite.dev/guide/migration`
     - `https://github.com/vitejs/vite/tree/main/docs/config`
     - `https://github.com/vitejs/vite/tree/main/docs/guide`

3. Inspect the project config.
   - Read the local `vite.config.*` file and any related env files or package scripts.
   - Match the config changes to the documented option names and defaults.

4. Respond with a minimal, accurate change.
   - Explain what the docs say.
   - Point out only the options that matter for this project.
   - If a config change is requested, keep it narrow and consistent with the repo's style.

## Good habits

- Treat newer Vite docs as higher priority than remembered defaults.
- If the user asks for a recommendation, prefer the simplest documented option that solves the problem.
- If a setting exists in the docs but is not needed here, say so instead of adding it.
- If the docs and the current project disagree, update the project only after confirming the impact.

## Typical doc lookup order

- General config question: `docs/config/index.md`
- Path aliases, base path, shared options: `docs/config/shared-options.md`
- Dev server behavior: `docs/config/server-options.md`
- Build output and bundling: `docs/config/build-options.md`
- Preview server behavior: `docs/config/preview-options.md`
- Dependency pre-bundling: `docs/config/dep-optimization-options.md`
- Migration or breaking changes: `docs/guide/migration.md`
