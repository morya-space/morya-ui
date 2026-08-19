import { execFileSync, execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { formatChangelogBody, prepareUiRelease, root } from './ui-changelog.mjs'

const PACKAGE_NAME = '@well-insight/ui'
const args = process.argv.slice(2)
const noPush = args.includes('--no-push')
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const bumpArg = args.find((item) => item === '--major' || item === '--minor' || item === '--patch')
const bump = bumpArg ? bumpArg.slice(2) : undefined

let commitMode = 'interactive'
if (args.includes('--all')) commitMode = 'all'
else if (args.includes('--ui-only')) commitMode = 'ui'
else if (args.includes('--none')) commitMode = 'none'

const releasePaths = ['package.json', 'CHANGELOG.md', 'CHANGELOG.en.md']

function run(command) {
  execSync(command, { cwd: root, stdio: 'inherit', shell: true })
}

function git(gitArgs, { allowFail = false, stdio = 'pipe' } = {}) {
  try {
    const output = execFileSync('git', gitArgs, {
      cwd: root,
      encoding: 'utf8',
      stdio: stdio === 'inherit' ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    })
    return typeof output === 'string' ? output.trim() : ''
  } catch (error) {
    if (allowFail) return ''
    throw error
  }
}

function hasStagedChanges() {
  return Boolean(git(['diff', '--cached', '--name-only'], { allowFail: true }))
}

function currentBranch() {
  return git(['symbolic-ref', '--short', 'HEAD'], { allowFail: true })
}

function commitReleaseFiles(version) {
  const existing = git(['ls-files', '--others', '--modified', '--exclude-standard'], { allowFail: true })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const unexpected = existing.filter(
    (file) => !releasePaths.some((path) => file === path || file.startsWith(`${path}/`)),
  )
  if (unexpected.length) {
    console.warn('Uncommitted files outside the release bump (left unstaged):')
    for (const file of unexpected) console.warn(`  ${file}`)
  }

  git(['add', '--', ...releasePaths.filter((path) => existsSync(join(root, path)))], { allowFail: true })
  if (hasStagedChanges()) {
    git(['commit', '-m', `release: ${PACKAGE_NAME} v${version}`], { stdio: 'inherit' })
    return true
  }
  console.log('No version files to commit')
  return false
}

console.log(`Releasing ${PACKAGE_NAME}`)

const dirty = git(['status', '--porcelain'], { allowFail: true })
if (dirty) {
  console.warn('Working tree has uncommitted files; commit them first if they should appear in CHANGELOG.')
}

const plan = await prepareUiRelease({ bump, dryRun, allowEmpty: force, commitMode })

if (plan.firstRelease) {
  console.log(`First release of current version ${plan.version} (no v* tag yet)`)
} else if (plan.resume) {
  console.log(
    `Resuming v${plan.version}: package.json / CHANGELOG already at this version, tag ${plan.previousTag || '(none)'} is behind`,
  )
} else {
  console.log(
    `${plan.previousVersion} → v${plan.version} (${plan.bump}, ${plan.commits.length} changelog entr${plan.commits.length === 1 ? 'y' : 'ies'})`,
  )
}

if (dryRun) {
  if (plan.resume) {
    console.log('No CHANGELOG rewrite; would tag / publish this version.')
  } else if (!plan.firstRelease) {
    console.log(`\nCHANGELOG.md preview:\n\n## ${plan.version}\n\n${formatChangelogBody(plan.commits, 'zh-CN')}\n`)
  }
  process.exit(0)
}

const sourceBranch = currentBranch()
if (!sourceBranch) {
  throw new Error('Detached HEAD: checkout a branch before releasing.')
}

commitReleaseFiles(plan.version)
run('node scripts/release-git.mjs --branch')

run('pnpm run build')
run('pnpm publish --access public --no-git-checks')
run('node scripts/release-git.mjs --tag --branch')

const releaseBranch = `release/${plan.version}`

if (noPush) {
  console.log(
    `Released v${plan.version} locally. Push with:\n  git push -u origin ${sourceBranch} --follow-tags\n  git push -u origin ${releaseBranch} --follow-tags`,
  )
  process.exit(0)
}

git(['push', '-u', 'origin', sourceBranch, '--follow-tags'], { stdio: 'inherit' })
run('node scripts/release-git.mjs --tag --branch --push')
console.log(
  `Released ${PACKAGE_NAME} v${plan.version} (tag v${plan.version}, committed on ${sourceBranch} and ${releaseBranch})`,
)
