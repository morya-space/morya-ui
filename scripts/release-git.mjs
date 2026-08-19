import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKAGE_NAME = '@well-insight/ui'
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const version = String(pkg.version ?? '').trim()

if (!/^\d+\.\d+\.\d+/.test(version)) {
  throw new Error(`Invalid ${PACKAGE_NAME} version: ${pkg.version}`)
}

const tag = `v${version}`
const branch = `release/${version}`
const args = new Set(process.argv.slice(2))
const wantBranch = args.has('--branch') || (!args.has('--tag') && !args.has('--branch'))
const wantTag = args.has('--tag') || (!args.has('--tag') && !args.has('--branch'))
const wantCheckout = args.has('--checkout')
const wantPush = args.has('--push')

function git(argsList, { allowFail = false } = {}) {
  try {
    return execFileSync('git', argsList, { cwd: root, encoding: 'utf8' }).trim()
  } catch (error) {
    if (allowFail) return ''
    throw error
  }
}

function refExists(ref) {
  return Boolean(git(['rev-parse', '--verify', '--quiet', ref], { allowFail: true }))
}

function currentBranch() {
  return git(['symbolic-ref', '--short', 'HEAD'], { allowFail: true })
}

if (wantBranch) {
  if (!refExists(`refs/heads/${branch}`)) {
    if (wantCheckout) git(['checkout', '-b', branch])
    else git(['branch', branch])
    console.log(`Created branch ${branch}`)
  } else if (wantCheckout && currentBranch() !== branch) {
    git(['checkout', branch])
    console.log(`Checked out ${branch}`)
  } else {
    console.log(`Branch ${branch} already exists`)
  }
}

if (wantTag) {
  if (!refExists(`refs/tags/${tag}`)) {
    git(['tag', '-a', tag, '-m', `${PACKAGE_NAME} ${tag}`])
    console.log(`Created tag ${tag}`)
  } else {
    console.log(`Tag ${tag} already exists`)
  }
}

if (wantPush) {
  if (wantBranch) {
    git(['push', '-u', 'origin', branch, '--follow-tags'])
    console.log(`Pushed branch ${branch}`)
  }
  if (wantTag) {
    git(['push', 'origin', tag])
    console.log(`Pushed tag ${tag}`)
  }
}
