#!/usr/bin/env node
/**
 * Extract --wk-* CSS variables from src CSS files, merge descriptions,
 * and emit playground/src/data/design-tokens.json for the docs site.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const stylesRoot = join(root, 'src')
const metadataPath = join(root, 'src/theme/token-descriptions.json')
const outputPath = join(root, 'playground/src/data/design-tokens.json')

const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'))

function walkCssFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'docs' || entry.name === '__tests__') continue
      walkCssFiles(full, files)
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.css')) files.push(full)
  }
  return files
}

function parseSelectorContext(selector) {
  const normalized = selector.replace(/\s+/g, ' ').trim()
  const contexts = new Set(['default'])

  if (/\[data-theme=["']dark["']\]/i.test(normalized)) contexts.add('dark')
  if (/\[data-wk-density=["']compact["']\]/i.test(normalized)) contexts.add('density-compact')
  if (/\[data-wk-density=["']spacious["']\]/i.test(normalized)) contexts.add('density-spacious')
  if (/\[data-wk-density=["']comfortable["']\]/i.test(normalized)) contexts.add('density-comfortable')
  if (/\[data-wk-motion=["']reduced["']\]/i.test(normalized)) contexts.add('motion-reduced')
  if (/\[data-wk-motion=["']none["']\]/i.test(normalized)) contexts.add('motion-none')

  if (contexts.size === 1 && contexts.has('default') && normalized !== ':root' && !normalized.startsWith(':root,')) {
    if (!/^:root(?:\s*,\s*\[data-wk-density="comfortable"\])?$/.test(normalized)) {
      contexts.add('scoped')
    }
  }

  return [...contexts]
}

function parseCssTokens(css, source) {
  const entries = new Map()
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const blockRe = /([^{]+)\{([^}]*)\}/g

  for (const match of withoutComments.matchAll(blockRe)) {
    const selector = match[1]
    const body = match[2]
    const contexts = parseSelectorContext(selector)
    const declRe = /(--wk-[a-z0-9-]+)\s*:\s*((?:[^;]|var\([^)]*\))+);/g

    for (const decl of body.matchAll(declRe)) {
      const name = decl[1]
      const value = decl[2].trim().replace(/\s+/g, ' ')
      const relSource = relative(root, source).replace(/\\/g, '/')

      if (!entries.has(name)) {
        entries.set(name, {
          name,
          source: relSource,
          values: {},
        })
      }

      const entry = entries.get(name)
      if (!entry.source || entry.source.startsWith('src/theme/')) entry.source = relSource

      for (const context of contexts) {
        entry.values[context] = value
      }
    }
  }

  return entries
}

function inferCategory(name) {
  const override = metadata.tokens?.[name]
  if (override?.category) return override.category

  const token = name.replace(/^--wk-/, '')
  if (token.startsWith('color-')) return 'color'
  if (token.startsWith('control-')) return 'control'
  if (token.startsWith('space-')) return 'spacing'
  if (token.startsWith('radius-')) return 'radius'
  if (token.startsWith('shadow-')) return 'shadow'
  if (token.startsWith('font-')) return 'typography'
  if (token.startsWith('motion-')) return 'motion'
  if (token.startsWith('z-')) return 'layering'
  if (token.startsWith('focus-')) return 'focus'
  if (token.startsWith('opacity-')) return 'state'
  if (token.startsWith('border-')) return 'border'
  if (token.startsWith('overlay-')) return 'overlay'
  if (token.startsWith('density-')) return 'density'
  if (token.startsWith('table-')) return 'table'
  if (token.startsWith('layout-')) return 'layout'
  if (token.startsWith('menu-') || token.includes('menu')) return 'menu'
  if (token.startsWith('tree-')) return 'tree'
  if (token.startsWith('timeline-')) return 'timeline'
  if (token.startsWith('slider-')) return 'slider'
  if (token.startsWith('rating-')) return 'rating'
  if (token.startsWith('tag-')) return 'tag'
  if (token.startsWith('stepper-')) return 'stepper'
  if (token.startsWith('dataview-')) return 'dataview'
  if (token.startsWith('checkbox-')) return 'control'
  return 'component'
}

function humanizeToken(name) {
  return name
    .replace(/^--wk-/, '')
    .split('-')
    .map((part) => (/^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
}

function inferDescription(name, category, lang) {
  const override = metadata.tokens?.[name]?.description?.[lang]
  if (override) return override

  const label = humanizeToken(name)
  if (lang === 'zh-CN') {
    const categoryHint = metadata.categories.find((item) => item.id === category)
    return `${categoryHint?.title?.['zh-CN'] ?? '样式'}相关变量：${label}`
  }
  const categoryHint = metadata.categories.find((item) => item.id === category)
  return `${categoryHint?.title?.['en-US'] ?? 'Style'} token: ${label}`
}

function buildCatalog() {
  const merged = new Map()

  for (const file of walkCssFiles(stylesRoot).sort()) {
    const css = readFileSync(file, 'utf8')
    for (const [name, entry] of parseCssTokens(css, file)) {
      if (!merged.has(name)) merged.set(name, entry)
      else {
        const existing = merged.get(name)
        existing.values = { ...existing.values, ...entry.values }
        if (entry.source.startsWith('src/theme/')) existing.source = entry.source
      }
    }
  }

  const tokens = [...merged.values()]
    .map((entry) => {
      const category = inferCategory(entry.name)
      const defaultValue = entry.values.default ?? entry.values['density-comfortable'] ?? Object.values(entry.values)[0] ?? ''
      const darkValue = entry.values.dark
      const variants = Object.fromEntries(
        Object.entries(entry.values).filter(([key]) => !['default', 'dark', 'scoped'].includes(key)),
      )

      return {
        name: entry.name,
        category,
        source: entry.source,
        default: defaultValue,
        dark: darkValue && darkValue !== defaultValue ? darkValue : undefined,
        variants: Object.keys(variants).length ? variants : undefined,
        description: {
          'zh-CN': inferDescription(entry.name, category, 'zh-CN'),
          'en-US': inferDescription(entry.name, category, 'en-US'),
        },
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    generatedAt: new Date().toISOString(),
    source: 'src/**/*.css',
    prefix: 'wk',
    categories: metadata.categories,
    tokenCount: tokens.length,
    tokens,
  }
}

function main() {
  const catalog = buildCatalog()
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`)
  console.log(`Generated ${catalog.tokenCount} design tokens → ${relative(root, outputPath)}`)
}

main()
