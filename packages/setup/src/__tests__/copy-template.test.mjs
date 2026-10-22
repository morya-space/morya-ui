import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import { copyTemplate } from '../copy-template.mjs'

/** @type {string[]} */
const temps = []

function makeDir() {
  const dir = mkdtempSync(join(tmpdir(), 'morya-setup-template-'))
  temps.push(dir)
  return dir
}

afterEach(() => {
  while (temps.length) {
    rmSync(temps.pop(), { recursive: true, force: true })
  }
})

function seedTemplate() {
  const root = makeDir()
  mkdirSync(join(root, '.agents/skills/morya-ui-pages'), { recursive: true })
  writeFileSync(join(root, 'DESIGN.md'), '# Design v2\n', 'utf8')
  writeFileSync(join(root, 'AGENTS.md'), '# Agents\n', 'utf8')
  writeFileSync(join(root, '.agents/skills/morya-ui-pages/SKILL.md'), '---\nname: morya-ui-pages\n---\nv2\n', 'utf8')
  return root
}

function read(cwd, rel) {
  return readFileSync(join(cwd, rel), 'utf8')
}

describe('copyTemplate', () => {
  it('copies fresh files into an empty project', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    const result = copyTemplate(template, cwd)
    assert.equal(result.copied.length, 3)
    assert.equal(result.updated.length, 0)
    assert.equal(result.unchanged.length, 0)
    assert.equal(read(cwd, 'DESIGN.md'), '# Design v2\n')
  })

  it('reports identical files as unchanged and leaves them alone', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    copyTemplate(template, cwd)
    const again = copyTemplate(template, cwd)
    assert.equal(again.copied.length, 0)
    assert.equal(again.updated.length, 0)
    assert.equal(again.unchanged.length, 3)
  })

  it('upgrades drifted files by default (re-run picks up new template)', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    copyTemplate(template, cwd)

    // Template evolves (e.g. newer @morya-ui/setup published).
    writeFileSync(join(template, '.agents/skills/morya-ui-pages/SKILL.md'), '---\nname: morya-ui-pages\n---\nv3\n', 'utf8')

    const result = copyTemplate(template, cwd)
    assert.equal(result.updated.length, 1)
    assert.equal(result.updated[0].replace(/\\/g, '/'), '.agents/skills/morya-ui-pages/SKILL.md')
    assert.match(read(cwd, '.agents/skills/morya-ui-pages/SKILL.md'), /v3/)
  })

  it('keepLocal preserves locally modified files', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    copyTemplate(template, cwd)

    // User edited the local copy.
    writeFileSync(join(cwd, 'DESIGN.md'), '# My local tweaks\n', 'utf8')

    const kept = copyTemplate(template, cwd, { keepLocal: true })
    assert.deepEqual(kept.keptLocal, ['DESIGN.md'])
    assert.equal(read(cwd, 'DESIGN.md'), '# My local tweaks\n')

    // Default behaviour would have upgraded it back.
    const upgraded = copyTemplate(template, cwd)
    assert.deepEqual(upgraded.updated, ['DESIGN.md'])
    assert.equal(read(cwd, 'DESIGN.md'), '# Design v2\n')
  })

  it('force overwrites even when keepLocal is set', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    copyTemplate(template, cwd)
    writeFileSync(join(cwd, 'DESIGN.md'), '# My local tweaks\n', 'utf8')

    const result = copyTemplate(template, cwd, { keepLocal: true, force: true })
    assert.deepEqual(result.forced, ['DESIGN.md'])
    assert.equal(result.keptLocal.length, 0)
    assert.equal(read(cwd, 'DESIGN.md'), '# Design v2\n')
  })

  it('respects include prefixes', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    const result = copyTemplate(template, cwd, { include: ['.agents/skills'] })
    assert.equal(result.copied.length, 1)
    assert.throws(() => read(cwd, 'DESIGN.md'), /ENOENT/)
  })

  it('dry-run reports actions without writing', () => {
    const template = seedTemplate()
    const cwd = makeDir()
    writeFileSync(join(cwd, 'DESIGN.md'), '# old\n', 'utf8')

    const result = copyTemplate(template, cwd, { dryRun: true })
    assert.deepEqual(result.updated, ['DESIGN.md'])
    assert.equal(result.copied.length, 2)
    // Nothing actually written.
    assert.equal(read(cwd, 'DESIGN.md'), '# old\n')
    assert.throws(() => read(cwd, 'AGENTS.md'), /ENOENT/)
  })
})
