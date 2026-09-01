import type { Component } from 'vue'
import type { DocsLang } from '../../i18n'

export interface GuideDocFrontmatter {
  title?: string
  order?: string | number
  description?: string
}

export interface GuideDocMeta {
  slug: string
  title: string
  order: number
  description?: string
}

export interface ResolvedGuideDoc {
  slug: string
  frontmatter: GuideDocFrontmatter
  component: Component
}

interface GuideModule {
  default: Component
  frontmatter?: GuideDocFrontmatter
}

type GuideLoader = () => Promise<GuideModule>

const guideLoaders = import.meta.glob<GuideModule>('./*.md')

const rawGuideModules = import.meta.glob<string>('./*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseGuidePath(path: string): { slug: string; lang: DocsLang } | null {
  const normalized = path.replace(/\\/g, '/')
  const match = normalized.match(/\/([^/]+?)(?:\.(en))?\.md$/)
  if (!match?.[1]) return null
  return {
    slug: match[1],
    lang: match[2] === 'en' ? 'en-US' : 'zh-CN',
  }
}

function parseFrontmatterFromRaw(raw: string): GuideDocFrontmatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match?.[1]) return {}

  const result: GuideDocFrontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep <= 0) continue
    const key = line.slice(0, sep).trim()
    const value = line.slice(sep + 1).trim()
    if (key === 'title' || key === 'description') result[key] = value
    if (key === 'order') result.order = value
  }
  return result
}

function resolveFrontmatter(path: string, mod: { frontmatter?: GuideDocFrontmatter }, slug: string) {
  const fromModule = mod.frontmatter
  const fromRaw = rawGuideModules[path] ? parseFrontmatterFromRaw(rawGuideModules[path]) : {}
  return {
    title: fromModule?.title ?? fromRaw.title ?? slug,
    order: fromModule?.order ?? fromRaw.order,
    description: fromModule?.description ?? fromRaw.description,
  } satisfies GuideDocFrontmatter
}

function findGuideLoader(slug: string, lang: DocsLang = 'zh-CN'): { path: string; loader: GuideLoader } | null {
  const entries = Object.entries(guideLoaders)
  const matchLang = (target: DocsLang) =>
    entries.find(([path]) => {
      const parsed = parseGuidePath(path)
      return parsed?.slug === slug && parsed.lang === target
    })

  const primary = matchLang(lang) ?? (lang === 'en-US' ? matchLang('zh-CN') : undefined)
  if (!primary) return null
  return { path: primary[0], loader: primary[1] }
}

export function listGuideDocs(lang: DocsLang = 'zh-CN'): GuideDocMeta[] {
  const items: GuideDocMeta[] = []
  for (const path of Object.keys(rawGuideModules)) {
    const parsed = parseGuidePath(path)
    if (!parsed || parsed.lang !== 'zh-CN') continue
    const enPath = path.replace(/\.md$/, '.en.md')
    const raw = lang === 'en-US' && rawGuideModules[enPath] ? rawGuideModules[enPath] : rawGuideModules[path]
    const frontmatter = parseFrontmatterFromRaw(raw)
    items.push({
      slug: parsed.slug,
      title: frontmatter.title ?? parsed.slug,
      order: Number(frontmatter.order ?? 99),
      description: frontmatter.description,
    })
  }
  return items.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}

export async function resolveGuideDoc(slug: string, lang: DocsLang = 'zh-CN'): Promise<ResolvedGuideDoc | null> {
  const resolved = findGuideLoader(slug, lang)
  if (!resolved) return null
  const mod = await resolved.loader()
  return {
    slug,
    frontmatter: resolveFrontmatter(resolved.path, mod, slug),
    component: mod.default,
  }
}

export function guideDocExists(slug: string, lang: DocsLang = 'zh-CN'): boolean {
  return findGuideLoader(slug, lang) !== null
}
