import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type Locale = 'zh-CN' | 'en-US'

export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
}

export interface ApiEvent {
  name: string
  payload?: string
  description: string
}

export interface ApiSlot {
  name: string
  description: string
}

export interface ExampleItem {
  id: string
  section: string
  sectionId: string
  lang: string
  preview: boolean
  code: string
  locale: Locale
}

export interface DocSection {
  id: string
  title: string
  body: string
}

export interface ComponentRecord {
  id: string
  name: string
  exportName: string
  category: string
  description: string
  descriptionEn: string
  import: string
  props: ApiProp[]
  events: ApiEvent[]
  slots: ApiSlot[]
  examples: ExampleItem[]
  locales: Partial<
    Record<
      Locale,
      {
        title: string
        description: string
        sections: DocSection[]
        markdown: string
      }
    >
  >
}

export interface GuideRecord {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  order: number
  locales: Partial<
    Record<
      Locale,
      {
        title: string
        description: string
        markdown: string
        sections: DocSection[]
      }
    >
  >
}

export interface Catalog {
  generatedAt: string
  library: { name: string; version: string }
  mcp: { name: string; version: string }
  components: ComponentRecord[]
  guides: GuideRecord[]
}

const here = dirname(fileURLToPath(import.meta.url))

export function loadCatalog(): Catalog {
  const path = join(here, '../data/catalog.json')
  return JSON.parse(readFileSync(path, 'utf8')) as Catalog
}

export function resolveLocale(mode?: string): Locale {
  const value = (mode || '').toLowerCase()
  if (value === 'en' || value === 'en-us' || value === 'english') return 'en-US'
  return 'zh-CN'
}

export function normalizeName(input: string): string {
  return input.trim().toLowerCase().replace(/^wd/, '').replace(/[-_\s]/g, '')
}

export function findComponent(catalog: Catalog, name: string): ComponentRecord | undefined {
  const key = normalizeName(name)
  return catalog.components.find((item) => {
    return (
      normalizeName(item.id) === key ||
      normalizeName(item.name) === key ||
      normalizeName(item.exportName) === key
    )
  })
}

export function findGuide(catalog: Catalog, name: string): GuideRecord | undefined {
  const key = normalizeName(name)
  return catalog.guides.find((item) => {
    return (
      normalizeName(item.id) === key ||
      normalizeName(item.title) === key ||
      normalizeName(item.titleEn || '') === key
    )
  })
}

export function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

export function textResult(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  }
}
