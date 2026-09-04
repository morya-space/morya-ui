import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isInteractive, promptBump, promptCommitSelection } from './interactive.mjs'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiPackagePath = join(root, 'package.json')
const changelogZhPath = join(root, 'CHANGELOG.md')
const changelogEnPath = join(root, 'CHANGELOG.en.md')
const PACKAGE_NAME = '@wex-design/ui'

/** Paths that count as “library” for default CHANGELOG selection. */
const LIB_PATHS = [
  'src',
  'playground',
  'package.json',
  'vite.config.ts',
  'vitest.config.ts',
  'tsconfig.json',
  'tsconfig.build.json',
]

const SKIP_SUBJECT = /^(release:|chore\(release\)|Merge )/i
const CONVENTIONAL = /^(feat|fix|docs|perf|refactor|style|test|chore|build|ci)(?:\([^)]+\))?(!)?:\s*(.+)$/i

const SECTION_TITLES = {
  'zh-CN': {
    breaking: '破坏性变更',
    feat: '新功能',
    fix: '修复',
    docs: '文档',
    other: '变更',
  },
  'en-US': {
    breaking: 'Breaking Changes',
    feat: 'Features',
    fix: 'Fixes',
    docs: 'Docs',
    other: 'Changes',
  },
}

export function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
  } catch (error) {
    if (allowFail) return ''
    throw error
  }
}

export function readUiPackage() {
  return JSON.parse(readFileSync(uiPackagePath, 'utf8'))
}

export function writeUiVersion(version) {
  const pkg = readUiPackage()
  if (pkg.version === version) return
  pkg.version = version
  writeFileSync(uiPackagePath, `${JSON.stringify(pkg, null, 2)}\n`)
}

export function lastVersionTag() {
  const tags = git(['tag', '-l', 'v*', '--sort=-v:refname'], { allowFail: true })
    .split(/\r?\n/)
    .map((tag) => tag.trim())
    .filter((tag) => /^v\d+\.\d+\.\d+/.test(tag))
  return tags[0] ?? ''
}

export function parseSemver(version) {
  const match = String(version ?? '').match(/^v?(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    raw: `${match[1]}.${match[2]}.${match[3]}`,
  }
}

export function compareSemver(a, b) {
  const pa = parseSemver(a)
  const pb = parseSemver(b)
  if (!pa && !pb) return 0
  if (!pa) return -1
  if (!pb) return 1
  return pa.major - pb.major || pa.minor - pb.minor || pa.patch - pb.patch
}

export function lastChangelogVersion(filePath) {
  const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  const match = raw.match(/^## (\d+\.\d+\.\d+)\s*$/m)
  return match?.[1] ?? ''
}

export function latestKnownVersion() {
  const versions = [
    readUiPackage().version,
    lastVersionTag().replace(/^v/, ''),
    lastChangelogVersion(changelogZhPath),
    lastChangelogVersion(changelogEnPath),
  ].filter((version) => parseSemver(version))
  return versions.sort(compareSemver).at(-1) ?? ''
}

export function lastReleaseRef(version) {
  if (!version) return lastVersionTag()
  const tag = `v${version}`
  if (git(['rev-parse', '--verify', '--quiet', tag], { allowFail: true })) return tag
  const hash = git(
    ['log', '-1', '--fixed-strings', `--grep=release: ${PACKAGE_NAME} v${version}`, '--pretty=format:%H'],
    { allowFail: true },
  )
  return hash || lastVersionTag()
}

export function changelogHasVersion(filePath, version) {
  const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  return new RegExp(`^## ${String(version).replace(/\./g, '\\.')}\\s*$`, 'm').test(raw)
}

export function parseCommit(subject) {
  const text = subject.trim()
  const match = text.match(CONVENTIONAL)
  if (!match) {
    return { type: 'other', breaking: false, message: text }
  }
  const type = match[1].toLowerCase()
  const breaking = Boolean(match[2]) || /\bbreaking\b/i.test(text)
  const message = (match[3] ?? text).trim()
  if (breaking) return { type: 'breaking', breaking: true, message }
  if (type === 'feat') return { type: 'feat', breaking: false, message }
  if (type === 'fix') return { type: 'fix', breaking: false, message }
  if (type === 'docs') return { type: 'docs', breaking: false, message }
  return { type: 'other', breaking: false, message }
}

/** All commits since tag. touchesUi marks library / docs-site path changes. */
export function collectCommits(sinceTag) {
  const range = sinceTag ? `${sinceTag}..HEAD` : 'HEAD'
  const output = git(['log', range, '--no-merges', '--pretty=format:%H\t%s'], { allowFail: true })
  if (!output) return []

  const uiHashes = new Set(
    git(['log', range, '--no-merges', '--pretty=format:%H', '--', ...LIB_PATHS], { allowFail: true })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  )

  const seen = new Set()
  const commits = []
  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const tab = trimmed.indexOf('\t')
    if (tab === -1) continue
    const hash = trimmed.slice(0, tab)
    const subject = trimmed.slice(tab + 1).trim()
    if (!subject || SKIP_SUBJECT.test(subject) || seen.has(hash)) continue
    seen.add(hash)
    commits.push({
      hash,
      subject,
      touchesUi: uiHashes.has(hash),
      ...parseCommit(subject),
    })
  }
  return commits
}

/** Suggestion only — final bump is always chosen by the user / CLI flag. */
export function suggestBump(commits) {
  if (commits.some((item) => item.breaking || item.type === 'breaking')) return 'major'
  if (commits.some((item) => item.type === 'feat')) return 'minor'
  return 'patch'
}

export function bumpVersion(version, bump) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) throw new Error(`Invalid version: ${version}`)
  let major = Number(match[1])
  let minor = Number(match[2])
  let patch = Number(match[3])
  if (bump === 'major') {
    major += 1
    minor = 0
    patch = 0
  } else if (bump === 'minor') {
    minor += 1
    patch = 0
  } else {
    patch += 1
  }
  return `${major}.${minor}.${patch}`
}

export function formatChangelogBody(commits, lang) {
  const titles = SECTION_TITLES[lang]
  const groups = {
    breaking: [],
    feat: [],
    fix: [],
    docs: [],
    other: [],
  }
  for (const commit of commits) {
    groups[commit.type]?.push(commit.message)
  }

  const parts = []
  for (const key of ['breaking', 'feat', 'fix', 'docs', 'other']) {
    const items = groups[key]
    if (!items?.length) continue
    parts.push(`### ${titles[key]}`, '', ...items.map((item) => `- ${item}`), '')
  }
  return parts.join('\n').trim()
}

export function prependChangelog(filePath, version, body) {
  const raw = readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
  const heading = `## ${version}`
  if (changelogHasVersion(filePath, version)) {
    console.log(`${filePath} already contains ${heading}, skip`)
    return false
  }
  const prefixMatch = raw.match(/^(# [^\n]+\n\r?\n)/)
  const block = `${heading}\n\n${body}\n\n`
  if (!prefixMatch?.[1]) {
    writeFileSync(filePath, `# ${PACKAGE_NAME}\n\n${block}${raw}`)
    return
  }
  writeFileSync(filePath, `${prefixMatch[1]}${block}${raw.slice(prefixMatch[1].length)}`)
}

export function writeChangelogs(version, commits) {
  prependChangelog(changelogZhPath, version, formatChangelogBody(commits, 'zh-CN'))
  prependChangelog(changelogEnPath, version, formatChangelogBody(commits, 'en-US'))
}

function pickCommits(allCommits, { commitMode, interactive }) {
  if (commitMode === 'all') return [...allCommits]
  if (commitMode === 'ui') return allCommits.filter((commit) => commit.touchesUi)
  if (commitMode === 'none') return []
  if (interactive) return promptCommitSelection(allCommits)
  return allCommits.filter((commit) => commit.touchesUi)
}

async function resolveBump({ bump, hint, previousVersion, interactive }) {
  if (bump) return bump
  if (interactive) return promptBump({ currentVersion: previousVersion, hint })
  throw new Error('Non-interactive release requires --patch, --minor, or --major')
}

/**
 * @param {{
 *   bump?: 'patch'|'minor'|'major'
 *   dryRun?: boolean
 *   allowEmpty?: boolean
 *   commitMode?: 'interactive'|'all'|'ui'|'none'
 * }} options
 */
export async function prepareUiRelease({
  bump,
  dryRun = false,
  allowEmpty = false,
  commitMode = 'interactive',
} = {}) {
  const pkg = readUiPackage()
  const previousTag = lastVersionTag()
  const previousVersion = latestKnownVersion() || previousTag.replace(/^v/, '') || pkg.version
  const sinceRef = lastReleaseRef(previousVersion) || previousTag
  const allCommits = collectCommits(sinceRef)
  const interactive = commitMode === 'interactive' && isInteractive()
  const tagVersion = previousTag.replace(/^v/, '')
  const canResume = Boolean(previousVersion && tagVersion !== previousVersion)

  if (!previousTag && !changelogHasVersion(changelogZhPath, pkg.version)) {
    return {
      firstRelease: true,
      resume: false,
      previousTag: '',
      previousVersion,
      version: pkg.version,
      bump: null,
      commits: [],
      allCommits,
    }
  }

  if (allCommits.length === 0 && canResume) {
    if (!dryRun) writeUiVersion(previousVersion)
    return {
      firstRelease: false,
      resume: true,
      previousTag,
      previousVersion,
      version: previousVersion,
      bump: null,
      commits: [],
      allCommits,
    }
  }

  if (allCommits.length === 0 && !allowEmpty) {
    throw new Error(`No commits since ${sinceRef || previousTag || previousVersion}. Commit changes first, or pass --force.`)
  }

  if (commitMode === 'interactive' && !isInteractive() && !bump) {
    throw new Error(
      'Non-interactive terminal: pass --patch|--minor|--major and --all or --ui-only (and optionally --force).',
    )
  }

  const selected =
    allCommits.length === 0
      ? []
      : await pickCommits(allCommits, { commitMode, interactive })

  if (selected.length === 0 && !allowEmpty) {
    throw new Error('No commits selected for CHANGELOG. Select some, or pass --force.')
  }

  const releaseCommits =
    selected.length > 0
      ? selected
      : [{ type: 'other', breaking: false, message: '维护更新', subject: '维护更新', hash: '', touchesUi: true }]

  const hint = suggestBump(releaseCommits)
  const nextBump = await resolveBump({
    bump,
    hint,
    previousVersion,
    interactive: interactive && !bump,
  })
  const version = bumpVersion(previousVersion, nextBump)

  if (!dryRun) {
    writeUiVersion(version)
    writeChangelogs(version, releaseCommits)
  }

  return {
    firstRelease: false,
    resume: false,
    previousTag,
    previousVersion,
    version,
    bump: nextBump,
    hint,
    commits: releaseCommits,
    allCommits,
  }
}
