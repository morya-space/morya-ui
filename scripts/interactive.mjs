import { stdin as input, stdout as output } from 'node:process'
import { checkbox, select } from '@inquirer/prompts'

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

/**
 * Multi-select commits for CHANGELOG.
 * Default: commits that touched library / docs-site source paths.
 * Uses arrow keys to navigate, space to toggle, enter to confirm.
 */
export async function promptCommitSelection(commits) {
  if (commits.length === 0) return []

  const choices = commits.map((commit, index) => ({
    value: index,
    name: `${commit.hash.slice(0, 7)}  ${commit.subject}`,
    checked: commit.touchesUi,
    description: commit.touchesUi ? 'touched library / docs-site paths' : undefined,
  }))

  console.log('\nSelect commits for CHANGELOG (space to toggle, enter to confirm):\n')

  try {
    const selectedIndexes = await checkbox({
      message: 'Include in CHANGELOG:',
      choices,
      pageSize: 15,
      instructions: false,
    })
    return selectedIndexes.map((index) => commits[index])
  } catch (error) {
    exitOnAbort(error)
  }
}

/**
 * Ask user for bump. hint is only a suggestion from selected commits.
 * Uses arrow keys to navigate.
 */
export async function promptBump({ currentVersion, hint }) {
  const defaultBump = hint || 'patch'

  console.log('\nVersion bump (you choose):')
  console.log('  Convention tip — feat → minor, fix/other → patch, feat!: / BREAKING → major')
  console.log(`  Current: ${currentVersion}`)
  if (hint) console.log(`  Hint from selected commits: ${hint}`)
  console.log('')

  try {
    return await select({
      message: 'Bump version:',
      choices: [
        { value: 'patch', name: `patch  (${currentVersion} → next patch)` },
        { value: 'minor', name: `minor  (${currentVersion} → next minor)` },
        { value: 'major', name: `major  (${currentVersion} → next major)` },
      ],
      default: defaultBump,
    })
  } catch (error) {
    exitOnAbort(error)
  }
}
