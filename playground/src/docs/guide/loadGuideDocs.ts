import type { Component } from 'vue'
import type { DocsLang } from '../../i18n'
import guideDocsManifest from 'virtual:guide-docs-manifest'

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

function parseGuidePath(path: string): { slug: string; lang: DocsLang } | null {
  const normalized = path.replace(/\\/g, '/')
  const match = normalized.match(/\/([^/]+?)(?:\.(en))?\.md$/)
  if (!match?.[1]) return null
  return {
    slug: match[1],
    lang: match[2] === 'en' ? 'en-US' : 'zh-CN',
  }
}

function manifestFrontmatter(slug: string, lang: DocsLang): GuideDocFrontmatter {
  const entry = guideDocsManifest[slug]
  if (!entry) return { title: slug, order: 99 }
  const raw = entry[lang] ?? entry['zh-CN']
  return {
    title: raw.title ?? slug,
    order: raw.order,
    description: raw.description,
  }
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
  for (const slug of Object.keys(guideDocsManifest).sort()) {
    const frontmatter = manifestFrontmatter(slug, lang)
    items.push({
      slug,
      title: frontmatter.title ?? slug,
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
  const fromModule = mod.frontmatter
  const fromManifest = manifestFrontmatter(slug, lang)
  return {
    slug,
    frontmatter: {
      title: fromModule?.title ?? fromManifest.title,
      order: fromModule?.order ?? fromManifest.order,
      description: fromModule?.description ?? fromManifest.description,
    },
    component: mod.default,
  }
}

export function guideDocExists(slug: string, lang: DocsLang = 'zh-CN'): boolean {
  return findGuideLoader(slug, lang) !== null
}
