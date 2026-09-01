import type { DocsLang } from '../i18n'
import changelogEnRaw from '../../../CHANGELOG.en.md?raw'
import changelogRaw from '../../../CHANGELOG.md?raw'
import { getUiPackageMeta } from './packageMeta'

export interface ChangelogSection {
  heading: string
  items: string[]
}

export interface ChangelogRelease {
  version: string
  /** Raw markdown body under this version heading (without the ## line). */
  body: string
  sections: ChangelogSection[]
}

export interface ChangelogDocument {
  packageName: string
  currentVersion: string
  releases: ChangelogRelease[]
}

function stripItemPrefix(line: string) {
  return line.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '').trim()
}

function parseSections(body: string): ChangelogSection[] {
  const sections: ChangelogSection[] = []
  let current: ChangelogSection | null = null

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trimEnd()
    const heading = line.match(/^###\s+(.+)$/)
    if (heading?.[1]) {
      current = { heading: heading[1].trim(), items: [] }
      sections.push(current)
      continue
    }

    if (!current) continue
    if (/^[-*+]\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())) {
      current.items.push(stripItemPrefix(line.trim()))
    } else if (line.trim() && current.items.length === 0) {
      // Paragraph under a section (e.g. coverage blurb) → keep as a soft item
      current.items.push(line.trim())
    } else if (line.trim() && current.items.length > 0 && !line.startsWith('#')) {
      const lastIndex = current.items.length - 1
      const last = current.items[lastIndex]
      if (last !== undefined) current.items[lastIndex] = `${last} ${line.trim()}`
    }
  }

  return sections.filter((section) => section.items.length > 0 || section.heading)
}

export function loadChangelog(lang: DocsLang = 'zh-CN'): ChangelogDocument {
  const { name: packageNameFromJson, version: currentVersion } = getUiPackageMeta()
  const source = lang === 'en-US' ? changelogEnRaw : changelogRaw
  const text = source.replace(/^\uFEFF/, '')
  const lines = text.split(/\r?\n/)

  let packageName = packageNameFromJson
  const releases: ChangelogRelease[] = []
  let currentVersionHeading: string | null = null
  let bodyLines: string[] = []

  const flush = () => {
    if (!currentVersionHeading) return
    const body = bodyLines.join('\n').trim()
    releases.push({
      version: currentVersionHeading,
      body,
      sections: parseSections(body),
    })
    bodyLines = []
  }

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/)
    if (h1?.[1]) {
      packageName = h1[1].trim()
      continue
    }

    const h2 = line.match(/^##\s+(.+)$/)
    if (h2?.[1]) {
      flush()
      currentVersionHeading = h2[1].trim().replace(/^v/i, '')
      continue
    }

    if (currentVersionHeading) bodyLines.push(line)
  }
  flush()

  return {
    packageName,
    currentVersion,
    releases,
  }
}

export { getUiPackageMeta } from './packageMeta'
