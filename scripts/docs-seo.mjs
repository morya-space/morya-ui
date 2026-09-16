/**
 * Post-build SEO for the docs SPA on GitHub Pages:
 * - Write real route/index.html shells (HTTP 200) with per-page meta + markdown body
 * - Emit sitemap.xml and robots.txt
 *
 * Vue still mounts client-side and replaces #app; crawlers get indexable HTML first.
 *
 * Note: avoid literal HTML closing tags in this file so Vitest/Vite import-analysis
 * does not treat the module as invalid markup.
 */
import { createRequire } from 'node:module'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const MarkdownIt = require('markdown-it')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

export const SITE_ORIGIN = 'https://morya-space.github.io/morya-ui'
export const DEFAULT_DESCRIPTION =
  'Morya UI — open-source Vue 3 component library with 90+ components, design tokens, light/dark themes, TypeScript, and interactive documentation.'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
})

function closeTag(name) {
  return '<' + '/' + name + '>'
}

/**
 * @param {string} raw
 * @returns {Record<string, string>}
 */
export function parseYamlFrontmatter(raw) {
  const normalized = raw.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}

  /** @type {Record<string, string>} */
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep <= 0) continue
    const key = line.slice(0, sep).trim()
    const value = line.slice(sep + 1).trim()
    if (key) result[key] = value
  }
  return result
}

/**
 * @param {string} raw
 */
export function prepareMarkdownBody(raw) {
  let body = raw.replace(/^\uFEFF/, '')
  body = body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
  // Drop interactive preview fences; keep surrounding prose for crawlers.
  body = body.replace(/```[^\n]*preview[^\n]*\r?\n[\s\S]*?```/gi, '')
  return body.trim()
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * @param {string} base
 * @param {string} routePath route without trailing slash, '' for home
 */
export function absoluteUrl(base, routePath) {
  const origin = base.replace(/\/$/, '')
  if (!routePath) return `${origin}/`
  return `${origin}/${routePath.replace(/^\//, '')}`
}

/**
 * @param {string} attr
 * @param {string} key
 */
function metaTagPattern(attr, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`<meta\\s+${attr}="${escapedKey}"[\\s\\S]*?\\/?>`, 'i')
}

/**
 * @param {string} html
 * @param {{ title: string, description: string, canonical: string, bodyHtml: string }} page
 */
export function injectSeoIntoHtml(html, page) {
  let next = html
  const headClose = closeTag('head')
  const titleOpen = '<title>'
  const titleClose = closeTag('title')

  next = next.replace(
    new RegExp(`${titleOpen}[\\s\\S]*?${titleClose}`, 'i'),
    `${titleOpen}${escapeHtml(page.title)}${titleClose}`,
  )

  const descriptionTag = `<meta name="description" content="${escapeHtml(page.description)}" />`
  if (metaTagPattern('name', 'description').test(next)) {
    next = next.replace(metaTagPattern('name', 'description'), descriptionTag)
  } else {
    next = next.replace(headClose, `    ${descriptionTag}\n  ${headClose}`)
  }

  const replacements = [
    ['property', 'og:title', page.title],
    ['property', 'og:description', page.description],
    ['property', 'og:url', page.canonical],
    ['name', 'twitter:title', page.title],
    ['name', 'twitter:description', page.description],
  ]

  for (const [attr, key, value] of replacements) {
    const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`
    const re = metaTagPattern(attr, key)
    if (re.test(next)) {
      next = next.replace(re, tag)
    } else {
      next = next.replace(headClose, `    ${tag}\n  ${headClose}`)
    }
  }

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(page.canonical)}" />`
  if (/<link\s+rel="canonical"/i.test(next)) {
    next = next.replace(/<link\s+rel="canonical"[\s\S]*?>/i, canonicalTag)
  } else {
    next = next.replace(headClose, `    ${canonicalTag}\n  ${headClose}`)
  }

  const appOpen = '<div id="app">'
  const appClose = closeTag('div')
  const seoBlock = [
    appOpen,
    '  <article class="seo-prerender" data-seo-prerender>',
    `    <h1>${escapeHtml(page.title)}${closeTag('h1')}`,
    page.bodyHtml,
    `  ${closeTag('article')}`,
    appClose,
  ].join('\n    ')

  const emptyApp = new RegExp(`${appOpen}\\s*${appClose}`, 'i')
  if (!emptyApp.test(next)) {
    throw new Error('Expected empty #app container in built index.html')
  }
  next = next.replace(emptyApp, seoBlock)

  return next
}

/**
 * @param {string} distDir
 * @param {string} routePath e.g. 'docs/quick-start' or ''
 * @param {string} html
 */
export function writeRouteHtml(distDir, routePath, html) {
  if (!routePath) {
    writeFileSync(path.join(distDir, 'index.html'), html, 'utf8')
    return
  }
  const outDir = path.join(distDir, ...routePath.split('/'))
  mkdirSync(outDir, { recursive: true })
  writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
}

/**
 * @returns {{ routePath: string, title: string, description: string, markdown?: string }[]}
 */
export function collectDocsSeoPages() {
  /** @type {{ routePath: string, title: string, description: string, markdown?: string }[]} */
  const pages = []

  pages.push({
    routePath: '',
    title: 'Morya UI — Vue 3 Component Library',
    description: DEFAULT_DESCRIPTION,
    markdown: [
      '# Morya UI',
      '',
      DEFAULT_DESCRIPTION,
      '',
      '- Docs: quick start, themes, design tokens, SSR',
      '- Components: 90+ Vue 3 components with live previews',
      '- npm: morya-ui',
    ].join('\n'),
  })

  const guideDir = path.join(repoRoot, 'playground/src/docs/guide')
  for (const entry of readdirSync(guideDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name.includes('.en.')) continue
    const slug = entry.name.replace(/\.md$/, '')
    const raw = readFileSync(path.join(guideDir, entry.name), 'utf8')
    const fm = parseYamlFrontmatter(raw)
    pages.push({
      routePath: `docs/${slug}`,
      title: `${fm.title || slug} · Morya UI`,
      description: fm.description || DEFAULT_DESCRIPTION,
      markdown: prepareMarkdownBody(raw),
    })
  }

  pages.push({
    routePath: 'components',
    title: 'Components · Morya UI',
    description: 'Browse 90+ Vue 3 components in Morya UI with interactive API docs and live previews.',
    markdown: [
      '# Components',
      '',
      'Browse the Morya UI component catalog with interactive documentation and live previews.',
    ].join('\n'),
  })

  const componentsDir = path.join(repoRoot, 'src/components')
  for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const docPath = path.join(componentsDir, entry.name, 'docs/index.md')
    if (!existsSync(docPath)) continue
    const raw = readFileSync(docPath, 'utf8')
    const fm = parseYamlFrontmatter(raw)
    pages.push({
      routePath: `components/${entry.name}`,
      title: `${fm.title || entry.name} · Morya UI`,
      description: fm.description || DEFAULT_DESCRIPTION,
      markdown: prepareMarkdownBody(raw),
    })
  }

  const changelogPath = path.join(repoRoot, 'CHANGELOG.md')
  const changelogRaw = existsSync(changelogPath)
    ? readFileSync(changelogPath, 'utf8')
    : '# Changelog\n\nRelease notes for Morya UI.'
  pages.push({
    routePath: 'changelog',
    title: 'Changelog · Morya UI',
    description: 'Release notes and breaking changes for Morya UI.',
    markdown: prepareMarkdownBody(changelogRaw).slice(0, 20000),
  })

  return pages
}

/**
 * @param {string[]} routePaths
 */
export function buildSitemapXml(routePaths) {
  const urls = routePaths.map((routePath) => {
    const loc = absoluteUrl(SITE_ORIGIN, routePath)
    const priority = routePath === '' ? '1.0' : routePath.startsWith('docs/') ? '0.8' : '0.6'
    return [
      '  <url>',
      `    <loc>${loc}${closeTag('loc')}`,
      `    <changefreq>weekly${closeTag('changefreq')}`,
      `    <priority>${priority}${closeTag('priority')}`,
      `  ${closeTag('url')}`,
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    closeTag('urlset'),
    '',
  ].join('\n')
}

export function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n')
}

/**
 * @param {string} [distDir]
 */
export function applyDocsSeo(distDir = path.join(repoRoot, 'playground/dist')) {
  const indexPath = path.join(distDir, 'index.html')
  if (!existsSync(indexPath)) {
    throw new Error(`Missing built index.html at ${indexPath}`)
  }

  const template = readFileSync(indexPath, 'utf8')
  const pages = collectDocsSeoPages()

  for (const page of pages) {
    const bodyHtml = md.render(page.markdown || page.description)
    const html = injectSeoIntoHtml(template, {
      title: page.title,
      description: page.description,
      canonical: absoluteUrl(SITE_ORIGIN, page.routePath),
      bodyHtml,
    })
    writeRouteHtml(distDir, page.routePath, html)
  }

  writeFileSync(
    path.join(distDir, 'sitemap.xml'),
    buildSitemapXml(pages.map((page) => page.routePath)),
    'utf8',
  )
  writeFileSync(path.join(distDir, 'robots.txt'), buildRobotsTxt(), 'utf8')

  // Keep SPA fallback for unknown client routes.
  writeFileSync(path.join(distDir, '404.html'), readFileSync(path.join(distDir, 'index.html'), 'utf8'), 'utf8')

  return {
    pageCount: pages.length,
    distDir,
  }
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const result = applyDocsSeo()
  console.log(`Docs SEO: wrote ${result.pageCount} pages + sitemap/robots in ${result.distDir}`)
}
