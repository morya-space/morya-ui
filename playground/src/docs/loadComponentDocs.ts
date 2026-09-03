import type { Component } from 'vue'
import type { DocsLang } from '../i18n'
import componentDocsManifest from 'virtual:component-docs-manifest'

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
  /** 原始 frontmatter，例如 `01 / BASIC` */
  category: string
  /** 分类排序号，缺省时靠后 */
  categoryOrder: number
  /** 分类展示名，例如 `BASIC` */
  categoryLabel: string
  description?: string
}

interface DocModule {
  default: Component
  frontmatter?: ComponentDocFrontmatter
}

type DocLoader = () => Promise<DocModule>

const zhDocLoaders = import.meta.glob<DocModule>('../../../src/components/*/docs/index.md')
const enDocLoaders = import.meta.glob<DocModule>('../../../src/components/*/docs/index.en.md')

function componentNameFromPath(path: string): string | null {
  const normalized = path.replace(/\\/g, '/')
  const match = normalized.match(/components\/([^/]+)\/docs\/index(?:\.en)?\.md$/)
  return match?.[1] ?? null
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

function manifestFrontmatter(name: string, lang: DocsLang): ComponentDocFrontmatter {
  const entry = componentDocsManifest[name]
  if (!entry) return { title: name }
  const raw = entry[lang] ?? entry['zh-CN']
  return {
    title: raw.title ?? name,
    category: raw.category,
    description: raw.description,
  }
}

function findDocLoader(name: string, lang: DocsLang = 'zh-CN'): { loader: DocLoader } | null {
  const preferEn = lang === 'en-US'
  const primaryLoaders = preferEn ? enDocLoaders : zhDocLoaders
  const primary = Object.entries(primaryLoaders).find(([path]) => componentNameFromPath(path) === name)
  if (primary) {
    return { loader: primary[1] }
  }
  const fallback = Object.entries(zhDocLoaders).find(([path]) => componentNameFromPath(path) === name)
  if (!fallback) return null
  return { loader: fallback[1] }
}

export function listDocumentedComponents(lang: DocsLang = 'zh-CN'): DocumentedComponentMeta[] {
  const items: DocumentedComponentMeta[] = []
  for (const name of Object.keys(componentDocsManifest).sort()) {
    const frontmatter = manifestFrontmatter(name, lang)
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

export async function resolveComponentDoc(name: string, lang: DocsLang = 'zh-CN'): Promise<ResolvedComponentDoc | null> {
  const resolved = findDocLoader(name, lang)
  if (!resolved) return null
  const mod = await resolved.loader()
  const fromModule = mod.frontmatter
  const fromManifest = manifestFrontmatter(name, lang)

  return {
    name,
    frontmatter: {
      title: fromModule?.title ?? fromManifest.title,
      category: fromModule?.category ?? fromManifest.category,
      description: fromModule?.description ?? fromManifest.description,
    },
    component: mod.default,
  }
}
