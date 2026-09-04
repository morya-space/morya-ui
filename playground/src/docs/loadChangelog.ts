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

const NOISE_ITEM =
  /^(update CHANGELOG|update check-docs-drift|enhance admin management|add admin management)/i

function normalizeVersion(version: string) {
  return version
    .replace(/^v/i, '')
    .replace(/（未发布）/g, '')
    .replace(/\(Unreleased\)/gi, '')
    .trim()
}

function stripItemPrefix(line: string) {
  return line.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '').trim()
}

function isNoiseItem(item: string) {
  return NOISE_ITEM.test(item.trim())
}

function mergeSections(a: ChangelogSection[], b: ChangelogSection[]): ChangelogSection[] {
  const map = new Map<string, Set<string>>()

  for (const section of [...a, ...b]) {
    const bucket = map.get(section.heading) ?? new Set<string>()
    for (const item of section.items) {
      if (!isNoiseItem(item)) bucket.add(item)
    }
    map.set(section.heading, bucket)
  }

  return [...map.entries()]
    .map(([heading, items]) => ({ heading, items: [...items] }))
    .filter((section) => section.items.length > 0)
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
      const item = stripItemPrefix(line.trim())
      if (!isNoiseItem(item)) current.items.push(item)
    } else if (line.trim() && current.items.length === 0) {
      if (!isNoiseItem(line.trim())) current.items.push(line.trim())
    } else if (line.trim() && current.items.length > 0 && !line.startsWith('#')) {
      const lastIndex = current.items.length - 1
      const last = current.items[lastIndex]
      if (last !== undefined) current.items[lastIndex] = `${last} ${line.trim()}`
    }
  }

  return sections.filter((section) => section.items.length > 0)
}

function upsertRelease(releases: ChangelogRelease[], release: ChangelogRelease) {
  const version = normalizeVersion(release.version)
  const normalized = { ...release, version }
  const index = releases.findIndex((item) => normalizeVersion(item.version) === version)

  if (index === -1) {
    releases.push(normalized)
    return
  }

  const existing = releases[index]!
  const mergedSections = mergeSections(existing.sections, normalized.sections)
  const body = mergedSections.length > normalized.sections.length
    || normalized.body.length > existing.body.length
    ? normalized.body || existing.body
    : existing.body || normalized.body

  releases[index] = {
    version,
    body,
    sections: mergedSections.length > 0 ? mergedSections : parseSections(body),
  }
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
    upsertRelease(releases, {
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
      currentVersionHeading = h2[1].trim()
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
