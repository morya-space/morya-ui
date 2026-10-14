import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import {
  declaresWorkspace,
  findDependencyRoot,
  listWorkspaceMembers,
  resolveSetupContext,
} from '../workspace.mjs'

/** @type {string[]} */
const temps = []

function makeCwd() {
  const cwd = mkdtempSync(join(tmpdir(), 'morya-setup-ws-'))
  temps.push(cwd)
  return cwd
}

afterEach(() => {
  while (temps.length) {
    rmSync(temps.pop(), { recursive: true, force: true })
  }
})

function writePkg(dir, obj) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), JSON.stringify(obj, null, 2), 'utf8')
}

function writeEntry(dir) {
  mkdirSync(join(dir, 'src'), { recursive: true })
  writeFileSync(join(dir, 'src', 'main.ts'), "import 'vue'\n", 'utf8')
}

/** Build a pnpm workspace: root + packages/app-a (morya consumer) + packages/lib. */
function makePnpmWorkspace() {
  const root = makeCwd()
  writePkg(root, { name: 'ws-root', private: true, version: '1.0.0' })
  writeFileSync(join(root, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n", 'utf8')
  writeFileSync(join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')

  const appA = join(root, 'packages', 'app-a')
  writePkg(appA, { name: 'app-a', private: true, dependencies: { 'morya-ui': '^1.0.0', vue: '^3.5.0' } })
  writeEntry(appA)

  const lib = join(root, 'packages', 'lib')
  writePkg(lib, { name: 'lib', private: true })
  return { root, appA, lib }
}

describe('declaresWorkspace', () => {
  it('detects pnpm-workspace.yaml', () => {
    const dir = makeCwd()
    writePkg(dir, { name: 'x', private: true })
    assert.equal(declaresWorkspace(dir, { name: 'x' }), false)
    writeFileSync(join(dir, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n", 'utf8')
    assert.equal(declaresWorkspace(dir, { name: 'x' }), true)
  })

  it('detects npm/yarn workspaces field (array and object)', () => {
    const dir = makeCwd()
    assert.equal(declaresWorkspace(dir, { workspaces: ['packages/*'] }), true)
    assert.equal(declaresWorkspace(dir, { workspaces: { packages: ['apps/*'] } }), true)
    assert.equal(declaresWorkspace(dir, { workspaces: [] }), false)
    assert.equal(declaresWorkspace(dir, {}), false)
  })
})

describe('findDependencyRoot', () => {
  it('walks up from a member to the workspace root', () => {
    const { root, appA } = makePnpmWorkspace()
    const found = findDependencyRoot(appA)
    assert.equal(found.root, root)
    assert.equal(found.isWorkspace, true)
  })

  it('returns the package itself for a plain single package', () => {
    const dir = makeCwd()
    writePkg(dir, { name: 'solo', version: '1.0.0' })
    writeFileSync(join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')
    const found = findDependencyRoot(dir)
    assert.equal(found.root, dir)
    assert.equal(found.isWorkspace, false)
  })
})

describe('listWorkspaceMembers', () => {
  it('expands pnpm workspace globs into member dirs', () => {
    const { root, appA, lib } = makePnpmWorkspace()
    const members = listWorkspaceMembers(root, { name: 'ws-root', private: true })
    assert.ok(members.includes(appA))
    assert.ok(members.includes(lib))
    assert.ok(!members.includes(root))
  })

  it('supports npm workspaces field', () => {
    const root = makeCwd()
    writePkg(root, { name: 'ws', private: true, workspaces: ['apps/*'] })
    const app = join(root, 'apps', 'web')
    writePkg(app, { name: 'web', private: true })
    const members = listWorkspaceMembers(root, { workspaces: ['apps/*'] })
    assert.ok(members.includes(app))
  })
})

describe('resolveSetupContext', () => {
  it('single package: config and install are the same dir', () => {
    const dir = makeCwd()
    writePkg(dir, { name: 'solo', version: '1.0.0' })
    writeFileSync(join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')
    const ctx = resolveSetupContext(dir)
    assert.equal(ctx.isWorkspace, false)
    assert.equal(ctx.configRoot, dir)
    assert.equal(ctx.installRoot, dir)
    assert.equal(ctx.appPackage, null)
  })

  it('invoked from a member: config at root, install at that member', () => {
    const { root, appA } = makePnpmWorkspace()
    const ctx = resolveSetupContext(appA)
    assert.equal(ctx.isWorkspace, true)
    assert.equal(ctx.configRoot, root)
    assert.equal(ctx.workspaceRoot, root)
    assert.equal(ctx.installRoot, appA)
    assert.equal(ctx.appPackage, appA)
  })

  it('invoked at root: config at root, install picks the morya-consuming app', () => {
    const { root, appA } = makePnpmWorkspace()
    const ctx = resolveSetupContext(root)
    assert.equal(ctx.isWorkspace, true)
    assert.equal(ctx.configRoot, root)
    assert.equal(ctx.installRoot, appA)
    assert.equal(ctx.appPackage, appA)
  })

  it('invoked at root: falls back to entry-bearing app when none declare morya', () => {
    const root = makeCwd()
    writePkg(root, { name: 'ws', private: true })
    writeFileSync(join(root, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n", 'utf8')
    writeFileSync(join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')
    const app = join(root, 'packages', 'web')
    writePkg(app, { name: 'web', private: true, dependencies: { vue: '^3.5.0' } })
    writeEntry(app)
    const lib = join(root, 'packages', 'lib')
    writePkg(lib, { name: 'lib', private: true })

    const ctx = resolveSetupContext(root)
    assert.equal(ctx.installRoot, app)
    assert.equal(ctx.appPackage, app)
  })

  it('invoked at root: falls back to root when no usable member exists', () => {
    const root = makeCwd()
    writePkg(root, { name: 'ws', private: true })
    writeFileSync(join(root, 'pnpm-workspace.yaml'), "packages:\n  - 'packages/*'\n", 'utf8')
    writeFileSync(join(root, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')
    const ctx = resolveSetupContext(root)
    assert.equal(ctx.installRoot, root)
    assert.equal(ctx.appPackage, null)
  })
})
