import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export function isInteractive() {
  return Boolean(input.isTTY && output.isTTY)
}

function exitOnAbort(error) {
  if (error?.code === 'ABORT_ERR' || error?.name === 'AbortError') {
    console.log('\nCancelled')
    process.exit(130)
  }
  throw error
}

async function withRl(fn) {
  const rl = readline.createInterface({ input, output })
  try {
    return await fn(rl)
  } catch (error) {
    exitOnAbort(error)
  } finally {
    rl.close()
  }
}

/**
 * Multi-select commits for CHANGELOG.
 * Default: commits that touched library / docs-site source paths.
 * Answers: Enter (defaults), all, lib, none, or "1,3,5-7"
 */
export async function promptCommitSelection(commits) {
  if (commits.length === 0) return []

  console.log('\nCommits since last release (select for CHANGELOG):\n')
  commits.forEach((commit, index) => {
    const mark = commit.touchesUi ? '*' : ' '
    const short = commit.hash.slice(0, 7)
    console.log(`  ${String(index + 1).padStart(2)}. [${mark}] ${short}  ${commit.subject}`)
  })
  console.log('\n  * = touched library / docs-site paths (default selection)')
  console.log('  Enter = keep defaults | all | lib | none | e.g. 1,3,5-7\n')

  const answer = (
    await withRl((rl) => rl.question('Include in CHANGELOG: '))
  )
    .trim()
    .toLowerCase()

  if (!answer) {
    return commits.filter((commit) => commit.touchesUi)
  }
  if (answer === 'all') return [...commits]
  if (answer === 'lib' || answer === 'ui') return commits.filter((commit) => commit.touchesUi)
  if (answer === 'none') return []

  const selected = new Set()
  for (const part of answer.split(/[,\s]+/).filter(Boolean)) {
    const range = part.match(/^(\d+)-(\d+)$/)
    if (range) {
      const start = Number(range[1])
      const end = Number(range[2])
      for (let i = Math.min(start, end); i <= Math.max(start, end); i += 1) {
        selected.add(i)
      }
      continue
    }
    const n = Number(part)
    if (!Number.isInteger(n)) {
      throw new Error(`Invalid selection: ${part}`)
    }
    selected.add(n)
  }

  const picked = []
  for (const n of selected) {
    if (n < 1 || n > commits.length) {
      throw new Error(`Selection out of range: ${n} (1-${commits.length})`)
    }
    picked.push(commits[n - 1])
  }
  return picked
}

/**
 * Ask user for bump. hint is only a suggestion from selected commits.
 */
export async function promptBump({ currentVersion, hint }) {
  console.log('\nVersion bump (you choose):')
  console.log('  Convention tip — feat → minor, fix/other → patch, feat!: / BREAKING → major')
  console.log(`  Current: ${currentVersion}`)
  if (hint) console.log(`  Hint from selected commits: ${hint}`)
  console.log('  Options: patch | minor | major\n')

  const defaultBump = hint || 'patch'
  const answer = (
    await withRl((rl) => rl.question(`Bump [${defaultBump}]: `))
  )
    .trim()
    .toLowerCase()

  const bump = answer || defaultBump
  if (!['patch', 'minor', 'major'].includes(bump)) {
    throw new Error(`Invalid bump: ${bump}`)
  }
  return bump
}
