import { SITE_DOCS_URL, SITE_NAME } from '../config/site'

export const DEFAULT_PAGE_DESCRIPTION =
  'Morya UI — open-source Vue 3 component library with 90+ components, design tokens, light/dark themes, TypeScript, and interactive documentation.'

export interface PageHeadInput {
  title: string
  description?: string
  /** Vue Router path without base, e.g. `/docs/quick-start` */
  path?: string
}

function canonicalFromPath(path = '/'): string {
  const base = SITE_DOCS_URL.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Update document head for the active docs route (SPA navigations). */
export function setPageHead(input: PageHeadInput) {
  if (typeof document === 'undefined') return

  const title = input.title.trim() || SITE_NAME
  const description = (input.description ?? DEFAULT_PAGE_DESCRIPTION).trim() || DEFAULT_PAGE_DESCRIPTION
  const canonical = canonicalFromPath(input.path)

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertLink('canonical', canonical)
}
