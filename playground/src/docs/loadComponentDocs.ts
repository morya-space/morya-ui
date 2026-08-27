import type { Component } from 'vue'
import type { DocsLang } from '../i18n'

export interface ComponentDocFrontmatter {
  title?: string
  category?: string
  description?: string
}

export interface ResolvedComponentDoc {
  name: string
  frontmatter: ComponentDocFrontmatter
  component: Component
}

export interface DocumentedComponentMeta {
  name: string
  /** 原始 frontmatter，例如 `01 / PRIMITIVE` */
  category: string
  /** 分类排序号，缺省时靠后 */
  categoryOrder: number
  /** 分类展示名，例如 `PRIMITIVE` */
  categoryLabel: string
  description?: string
}

interface DocModule {
  default: Component
  frontmatter?: ComponentDocFrontmatter
}

const zhDocModules = import.meta.glob<DocModule>('../../../src/components/*/docs/index.md', { eager: true })
const enDocModules = import.meta.glob<DocModule>('../../../src/components/*/docs/index.en.md', { eager: true })

const zhRawDocModules = import.meta.glob<string>('../../../src/components/*/docs/index.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const enRawDocModules = import.meta.glob<string>('../../../src/components/*/docs/index.en.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function componentNameFromPath(path: string): string | null {
  const normalized = path.replace(/\\/g, '/')
  const match = normalized.match(/components\/([^/]+)\/docs\/index(?:\.en)?\.md$/)
  return match?.[1] ?? null
}

function parseFrontmatterFromRaw(raw: string): ComponentDocFrontmatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}

  const result: ComponentDocFrontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep <= 0) continue
    const key = line.slice(0, sep).trim()
    const value = line.slice(sep + 1).trim()
    if (key === 'title' || key === 'category' || key === 'description') {
      result[key] = value
    }
  }
  return result
}

function parseCategory(raw?: string): Pick<DocumentedComponentMeta, 'category' | 'categoryOrder' | 'categoryLabel'> {
  const category = raw?.trim() || '99 / OTHER'
  const match = category.match(/^(\d+)\s*\/\s*(.+)$/)
  if (!match?.[1] || !match[2]) {
    return { category, categoryOrder: 99, categoryLabel: category }
  }
  return {
    category,
    categoryOrder: Number(match[1]),
    categoryLabel: match[2].trim(),
  }
}

function resolveFrontmatter(
  path: string,
  mod: { frontmatter?: ComponentDocFrontmatter },
  name: string,
  rawModules: Record<string, string>,
) {
  const fromModule = mod.frontmatter
  const fromRaw = rawModules[path] ? parseFrontmatterFromRaw(rawModules[path]) : {}
  return {
    title: fromModule?.title ?? fromRaw.title ?? name,
    category: fromModule?.category ?? fromRaw.category,
    description: fromModule?.description ?? fromRaw.description,
  } satisfies ComponentDocFrontmatter
}

function findDocEntry(name: string, lang: DocsLang = 'zh-CN') {
  const preferEn = lang === 'en-US'
  const primaryModules = preferEn ? enDocModules : zhDocModules
  const primaryRaw = preferEn ? enRawDocModules : zhRawDocModules
  const primary = Object.entries(primaryModules).find(([path]) => componentNameFromPath(path) === name)
  if (primary) {
    return { path: primary[0], mod: primary[1], raw: primaryRaw }
  }
  const fallback = Object.entries(zhDocModules).find(([path]) => componentNameFromPath(path) === name)
  if (!fallback) return null
  return { path: fallback[0], mod: fallback[1], raw: zhRawDocModules }
}

export function listDocumentedComponents(lang: DocsLang = 'zh-CN'): DocumentedComponentMeta[] {
  const items: DocumentedComponentMeta[] = []
  for (const [path, mod] of Object.entries(zhDocModules)) {
    const name = componentNameFromPath(path)
    if (!name) continue
    const resolved = findDocEntry(name, lang)
    if (!resolved) continue
    const frontmatter = resolveFrontmatter(resolved.path, resolved.mod, name, resolved.raw)
    const parsed = parseCategory(frontmatter.category)
    items.push({
      name,
      description: frontmatter.description,
      ...parsed,
    })
  }
  return items.sort((a, b) => a.categoryOrder - b.categoryOrder || a.name.localeCompare(b.name))
}

export function listDocumentedComponentNames(): string[] {
  return listDocumentedComponents().map((item) => item.name)
}

export function resolveComponentDoc(name: string, lang: DocsLang = 'zh-CN'): ResolvedComponentDoc | null {
  const resolved = findDocEntry(name, lang)
  if (!resolved) return null

  return {
    name,
    frontmatter: resolveFrontmatter(resolved.path, resolved.mod, name, resolved.raw),
    component: resolved.mod.default,
  }
}
