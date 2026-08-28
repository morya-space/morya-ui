import { execFileSync, execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { formatChangelogBody, prepareUiRelease, readUiPackage, root } from './ui-changelog.mjs'

export const PACKAGE_NAME = '@well-insight/ui'
export const UI_RELEASE_PATHS = ['package.json', 'CHANGELOG.md', 'CHANGELOG.en.md']
export const MCP_RELEASE_PATHS = [
  'packages/ui-mcp/package.json',
  'packages/ui-mcp/data/catalog.json',
  'packages/ui-mcp/data/example-coverage.json',
]
/** Build before commit so MCP catalog is included in the release commit. */
export const STEPS = ['prepare', 'build', 'commit', 'branch', 'publish', 'tag', 'push']

export function run(command) {
  execSync(command, { cwd: root, stdio: 'inherit', shell: true })
}

export function git(gitArgs, { allowFail = false, stdio = 'pipe' } = {}) {
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

export function currentBranch() {
  return git(['symbolic-ref', '--short', 'HEAD'], { allowFail: true })
}

export function readVersion() {
  return String(readUiPackage().version ?? '').trim()
}

function hasStagedChanges() {
  return Boolean(git(['diff', '--cached', '--name-only'], { allowFail: true }))
}

function releasePaths({ noMcp }) {
  return noMcp ? UI_RELEASE_PATHS : [...UI_RELEASE_PATHS, ...MCP_RELEASE_PATHS]
}

async function loadMcp() {
  return import('./release-mcp.mjs')
}

export function parseReleaseOptions(argv) {
  const args = [...argv]
  const knownSteps = new Set(STEPS)
  let step = null
  const flags = []

  for (const arg of args) {
    if (!arg.startsWith('-') && knownSteps.has(arg) && !step) {
      step = arg
      continue
    }
    flags.push(arg)
  }

  const noPush = flags.includes('--no-push')
  const noMcp = flags.includes('--no-mcp')
  const dryRun = flags.includes('--dry-run')
  const force = flags.includes('--force')
  const bumpArg = flags.find((item) => item === '--major' || item === '--minor' || item === '--patch')
  const bump = bumpArg ? bumpArg.slice(2) : undefined

  let commitMode = 'interactive'
  if (flags.includes('--all')) commitMode = 'all'
  else if (flags.includes('--ui-only')) commitMode = 'ui'
  else if (flags.includes('--none')) commitMode = 'none'

  const fromArg = flags.find((item) => item.startsWith('--from='))
  const untilArg = flags.find((item) => item.startsWith('--until='))
  const from = fromArg ? fromArg.slice('--from='.length) : undefined
  const until = untilArg ? untilArg.slice('--until='.length) : undefined

  return {
    step,
    from,
    until,
    bump,
    dryRun,
    force,
    noPush,
    noMcp,
    commitMode,
  }
}

export function warnIgnoredDryRun(selectedSteps, dryRun) {
  if (dryRun && !selectedSteps.includes('prepare')) {
    console.warn('--dry-run only applies to the prepare step; continuing with real execution.')
  }
}

export function resolveSteps({ step, from, until, noPush }) {
  if (step) {
    if (!STEPS.includes(step)) {
      throw new Error(`Unknown release step: ${step}. Valid: ${STEPS.join(', ')}`)
    }
    if (noPush && step === 'push') {
      throw new Error('Cannot run push step with --no-push')
    }
    return [step]
  }

  let start = 0
  let end = STEPS.length - 1

  if (from) {
    const index = STEPS.indexOf(from)
    if (index === -1) throw new Error(`Unknown --from step: ${from}`)
    start = index
  }

  if (until) {
    const index = STEPS.indexOf(until)
    if (index === -1) throw new Error(`Unknown --until step: ${until}`)
    end = index
  }

  if (start > end) {
    throw new Error(`Invalid step range: ${STEPS[start]} .. ${STEPS[end]}`)
  }

  let selected = STEPS.slice(start, end + 1)
  if (noPush) {
    selected = selected.filter((name) => name !== 'push')
  }
  return selected
}

function ensureOnBranch() {
  const branch = currentBranch()
  if (!branch) {
    throw new Error('Detached HEAD: checkout a branch before releasing.')
  }
  return branch
}

function warnDirtyWorkingTree() {
  const dirty = git(['status', '--porcelain'], { allowFail: true })
  if (dirty) {
    console.warn('Working tree has uncommitted files; commit them first if they should appear in CHANGELOG.')
  }
}

function logPlan(plan) {
  if (plan.firstRelease) {
    console.log(`First release of current version ${plan.version} (no v* tag yet)`)
    return
  }
  if (plan.resume) {
    console.log(
      `Resuming v${plan.version}: package.json / CHANGELOG already at this version, tag ${plan.previousTag || '(none)'} is behind`,
    )
    return
  }
  console.log(
    `${plan.previousVersion} → v${plan.version} (${plan.bump}, ${plan.commits.length} changelog entr${plan.commits.length === 1 ? 'y' : 'ies'})`,
  )
}

export async function stepPrepare(options) {
  console.log(`[prepare] ${PACKAGE_NAME}`)
  warnDirtyWorkingTree()

  const plan = await prepareUiRelease({
    bump: options.bump,
    dryRun: options.dryRun,
    allowEmpty: options.force,
    commitMode: options.commitMode,
  })

  logPlan(plan)

  if (options.dryRun) {
    if (plan.resume) {
      console.log('No CHANGELOG rewrite; would continue with build / commit / publish steps.')
    } else if (!plan.firstRelease) {
      console.log(`\nCHANGELOG.md preview:\n\n## ${plan.version}\n\n${formatChangelogBody(plan.commits, 'zh-CN')}\n`)
    }
    if (!options.noMcp) {
      console.log(`Would also sync ${MCP_RELEASE_PATHS[0]} to v${plan.version}`)
    }
  } else {
    if (!plan.firstRelease && !plan.resume) {
      console.log(`Updated version files for v${plan.version}`)
    }
    if (!options.noMcp) {
      const { syncMcpVersion } = await loadMcp()
      syncMcpVersion(plan.version)
    }
  }

  return plan
}

export async function stepBuild(options = {}) {
  console.log('[build] @well-insight/ui')
  run('pnpm run build')
  if (!options.noMcp) {
    const { buildMcp } = await loadMcp()
    buildMcp()
  }
}

export function stepCommit(options = {}) {
  console.log('[commit] release files')
  ensureOnBranch()

  const version = readVersion()
  const paths = releasePaths(options)
  const existing = git(['ls-files', '--others', '--modified', '--exclude-standard'], { allowFail: true })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const unexpected = existing.filter(
    (file) => !paths.some((path) => file === path || file.startsWith(`${path}/`)),
  )
  if (unexpected.length) {
    console.warn('Uncommitted files outside the release bump (left unstaged):')
    for (const file of unexpected) console.warn(`  ${file}`)
  }

  git(['add', '--', ...paths.filter((path) => existsSync(join(root, path)))], { allowFail: true })
  if (hasStagedChanges()) {
    const message = options.noMcp
      ? `release: ${PACKAGE_NAME} v${version}`
      : `release: ${PACKAGE_NAME} / @well-insight/ui-mcp v${version}`
    git(['commit', '-m', message], { stdio: 'inherit' })
    console.log(`Committed ${message}`)
    return true
  }

  console.log('No version files to commit')
  return false
}

export function stepBranch() {
  console.log('[branch] release/{version}')
  run('node scripts/release-git.mjs --branch')
}

export async function stepPublish(options = {}) {
  console.log('[publish] @well-insight/ui')
  run('pnpm publish --access public --no-git-checks')
  if (!options.noMcp) {
    const { publishMcp } = await loadMcp()
    publishMcp()
  }
}

export function stepTag() {
  console.log('[tag] v{version}')
  run('node scripts/release-git.mjs --tag')
}

export function stepPush({ sourceBranch } = {}) {
  console.log('[push] branches and tags')
  const branch = sourceBranch || ensureOnBranch()
  const version = readVersion()
  const releaseBranch = `release/${version}`

  git(['push', '-u', 'origin', branch, '--follow-tags'], { stdio: 'inherit' })
  run('node scripts/release-git.mjs --tag --branch --push')
  console.log(
    `Pushed ${PACKAGE_NAME} v${version} (${branch}, ${releaseBranch}, tag v${version})`,
  )
}

export function printNextStepHint(completedStep, selectedSteps) {
  const index = selectedSteps.indexOf(completedStep)
  if (index === -1 || index >= selectedSteps.length - 1) return
  const next = selectedSteps[index + 1]
  console.log(`Next: pnpm release:${next}`)
}

export async function runReleaseSteps(selectedSteps, options) {
  let sourceBranch = currentBranch()
  let plan = null

  for (const step of selectedSteps) {
    switch (step) {
      case 'prepare':
        plan = await stepPrepare(options)
        if (options.dryRun) {
          if (selectedSteps.length === 1) printNextStepHint('prepare', STEPS)
          return { plan, sourceBranch, selectedSteps }
        }
        break
      case 'build':
        await stepBuild(options)
        break
      case 'commit':
        stepCommit(options)
        sourceBranch = currentBranch() || sourceBranch
        break
      case 'branch':
        stepBranch()
        break
      case 'publish':
        await stepPublish(options)
        break
      case 'tag':
        stepTag()
        break
      case 'push':
        stepPush({ sourceBranch })
        break
      default:
        throw new Error(`Unknown release step: ${step}`)
    }

    if (selectedSteps.length === 1) {
      printNextStepHint(step, STEPS)
    }
  }

  if (options.noPush && selectedSteps.includes('tag')) {
    const version = plan?.version || readVersion()
    const releaseBranch = `release/${version}`
    const branch = sourceBranch || currentBranch() || '<branch>'
    console.log(
      `Release v${version} finished locally. Push with:\n  git push -u origin ${branch} --follow-tags\n  git push -u origin ${releaseBranch} --follow-tags`,
    )
  } else if (selectedSteps.length > 1 && selectedSteps.at(-1) !== 'push') {
    const last = selectedSteps.at(-1)
    const lastIndex = STEPS.indexOf(last)
    const next = STEPS[lastIndex + 1]
    if (next) {
      console.log(`Stopped after ${last}. Continue with: pnpm release:${next}`)
    }
  } else if (selectedSteps.length > 1 && selectedSteps.at(-1) === 'push') {
    const version = plan?.version || readVersion()
    const mcpNote = options.noMcp ? '' : ' (+ @well-insight/ui-mcp)'
    console.log(`Released ${PACKAGE_NAME} v${version}${mcpNote}`)
  }

  return { plan, sourceBranch, selectedSteps }
}

/** @deprecated Use UI_RELEASE_PATHS / MCP_RELEASE_PATHS; kept for any external imports. */
export const RELEASE_PATHS = [...UI_RELEASE_PATHS, ...MCP_RELEASE_PATHS]
