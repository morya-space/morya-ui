#!/usr/bin/env node
/**
 * Build the docs site for GitHub Pages (subpath /morya-ui/),
 * then emit SEO prerender shells + sitemap/robots.
 */
import { spawnSync } from 'node:child_process'
import { applyDocsSeo } from './docs-seo.mjs'

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

const seo = applyDocsSeo()
console.log(`GitHub Pages build ready in ${seo.distDir}/ (${seo.pageCount} SEO pages)`)
