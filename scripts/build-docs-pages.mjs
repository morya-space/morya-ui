#!/usr/bin/env node
/**
 * Build the docs site for GitHub Pages (subpath /wex-design-ui/) and add SPA 404 fallback.
 */
import { copyFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

process.env.GITHUB_PAGES = 'true'

const result = spawnSync(
  'pnpm',
  ['exec', 'vite', 'build', '--config', 'playground/vite.config.ts'],
  { stdio: 'inherit', shell: true },
)

if (result.error) {
  console.error(result.error)
  process.exit(1)
}

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

copyFileSync('playground/dist/index.html', 'playground/dist/404.html')
console.log('GitHub Pages build ready in playground/dist/')
