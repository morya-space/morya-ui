import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import {
  buildCreateViteCommand,
  buildInstallCommand,
  isValidProjectName,
  resolveViteTemplate,
  scaffoldProject,
} from '../scaffold.mjs'

/** @type {string[]} */
const temps = []

function makeCwd() {
  const cwd = mkdtempSync(join(tmpdir(), 'morya-setup-scaffold-'))
  temps.push(cwd)
  return cwd
}

afterEach(() => {
  while (temps.length) {
    rmSync(temps.pop(), { recursive: true, force: true })
  }
})

describe('isValidProjectName', () => {
  it('accepts simple lowercase names', () => {
    assert.ok(isValidProjectName('my-app'))
    assert.ok(isValidProjectName('admin'))
    assert.ok(isValidProjectName('my_app.v2'))
    assert.ok(isValidProjectName('~tilde'))
  })

  it('accepts nested paths by validating the last segment', () => {
    assert.ok(isValidProjectName('apps/my-app'))
    assert.ok(isValidProjectName('foo/bar/baz'))
  })

  it('rejects invalid names', () => {
    assert.ok(!isValidProjectName(''))
    assert.ok(!isValidProjectName('My-App'))
    assert.ok(!isValidProjectName('.hidden'))
    assert.ok(!isValidProjectName('_private'))
    assert.ok(!isValidProjectName('has space'))
    assert.ok(!isValidProjectName('/'))
  })
})

describe('resolveViteTemplate', () => {
  it('returns explicit template aliases', async () => {
    assert.equal(await resolveViteTemplate({ template: 'vue-ts' }), 'vue-ts')
    assert.equal(await resolveViteTemplate({ template: 'ts' }), 'vue-ts')
    assert.equal(await resolveViteTemplate({ template: 'typescript' }), 'vue-ts')
    assert.equal(await resolveViteTemplate({ template: 'vue' }), 'vue')
    assert.equal(await resolveViteTemplate({ template: 'js' }), 'vue')
  })

  it('rejects unknown template', async () => {
    await assert.rejects(() => resolveViteTemplate({ template: 'react' }), /Unknown --template/)
  })

  it('falls back to vue-ts when non-interactive', async () => {
    assert.equal(await resolveViteTemplate({ interactive: false }), 'vue-ts')
    assert.equal(await resolveViteTemplate({}), 'vue-ts')
  })
})

describe('buildCreateViteCommand', () => {
  it('builds per-pm commands', () => {
    assert.equal(buildCreateViteCommand('pnpm', 'my-app', 'vue-ts'), 'pnpm create vite my-app --template vue-ts')
    assert.equal(buildCreateViteCommand('yarn', 'my-app', 'vue'), 'yarn create vite my-app --template vue')
    assert.equal(buildCreateViteCommand('npm', 'my-app', 'vue-ts'), 'npm create vite@latest my-app -- --template vue-ts')
  })

  it('rejects unknown pm', () => {
    assert.throws(() => buildCreateViteCommand('bun', 'x', 'vue-ts'), /Unknown package manager/)
  })
})

describe('buildInstallCommand', () => {
  it('builds per-pm install commands', () => {
    assert.equal(buildInstallCommand('pnpm'), 'pnpm install')
    assert.equal(buildInstallCommand('yarn'), 'yarn install')
    assert.equal(buildInstallCommand('npm'), 'npm install')
  })
})

describe('scaffoldProject', () => {
  it('rejects invalid names', async () => {
    const parent = makeCwd()
    await assert.rejects(
      () => scaffoldProject(parent, 'Bad Name', { pm: 'pnpm', dryRun: true }),
      /Invalid project name/,
    )
  })

  it('rejects existing non-empty directory', async () => {
    const parent = makeCwd()
    const target = join(parent, 'my-app')
    mkdirSync(target, { recursive: true })
    writeFileSync(join(target, 'file.txt'), 'x', 'utf8')
    await assert.rejects(
      () => scaffoldProject(parent, 'my-app', { pm: 'pnpm', dryRun: true }),
      /already exists and is not empty/,
    )
  })

  it('allows existing empty directory', async () => {
    const parent = makeCwd()
    mkdirSync(join(parent, 'my-app'), { recursive: true })
    const result = await scaffoldProject(parent, 'my-app', { pm: 'pnpm', dryRun: true })
    assert.equal(result.skipped, true)
    assert.equal(result.reason, 'dry-run')
    assert.equal(result.template, 'vue-ts')
  })

  it('dry-run reports commands without executing', async () => {
    const parent = makeCwd()
    const result = await scaffoldProject(parent, 'my-app', { pm: 'pnpm', dryRun: true })
    assert.equal(result.cwd, join(parent, 'my-app'))
    assert.equal(result.command, 'pnpm create vite my-app --template vue-ts')
    assert.equal(result.installCommand, 'pnpm install')
    assert.equal(result.skipped, true)
  })

  it('respects explicit template', async () => {
    const parent = makeCwd()
    const result = await scaffoldProject(parent, 'my-app', { pm: 'npm', template: 'vue', dryRun: true })
    assert.equal(result.template, 'vue')
    assert.equal(result.command, 'npm create vite@latest my-app -- --template vue')
    assert.equal(result.installCommand, 'npm install')
  })
})
