import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import {
  DEFAULT_EDITORS,
  SERVER_CONFIG,
  VSCODE_SERVER_CONFIG,
  mergeMcpConfig,
  parseEditorsFlag,
} from '../mcp.mjs'

/** @type {string[]} */
const temps = []

function makeCwd() {
  const cwd = mkdtempSync(join(tmpdir(), 'morya-setup-mcp-'))
  temps.push(cwd)
  return cwd
}

afterEach(() => {
  while (temps.length) {
    rmSync(temps.pop(), { recursive: true, force: true })
  }
})

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

describe('parseEditorsFlag', () => {
  it('defaults to all known editors', () => {
    assert.deepEqual(parseEditorsFlag(), [...DEFAULT_EDITORS])
    assert.deepEqual(parseEditorsFlag('all'), [...DEFAULT_EDITORS])
  })

  it('parses and dedupes a subset', () => {
    assert.deepEqual(parseEditorsFlag('zed,cursor,zed'), ['zed', 'cursor'])
  })

  it('rejects unknown editors', () => {
    assert.throws(() => parseEditorsFlag('cursor,windsurf'), /Unknown editor/)
  })
})

describe('mergeMcpConfig', () => {
  it('creates cursor, vscode, zed, and portable configs', () => {
    const cwd = makeCwd()
    const { results } = mergeMcpConfig(cwd)

    assert.equal(results.length, 4)
    assert.deepEqual(
      results.map((r) => r.editor),
      ['cursor', 'vscode', 'zed', 'portable'],
    )
    assert.ok(results.every((r) => r.action === 'created'))

    assert.deepEqual(readJson(join(cwd, '.cursor', 'mcp.json')), {
      mcpServers: { 'morya-ui': SERVER_CONFIG },
    })
    assert.deepEqual(readJson(join(cwd, '.vscode', 'mcp.json')), {
      servers: { 'morya-ui': VSCODE_SERVER_CONFIG },
    })
    assert.deepEqual(readJson(join(cwd, '.zed', 'settings.json')), {
      context_servers: { 'morya-ui': SERVER_CONFIG },
    })
    assert.deepEqual(readJson(join(cwd, '.mcp.json')), {
      mcpServers: { 'morya-ui': SERVER_CONFIG },
    })
  })

  it('skips existing morya-ui entries unless force', () => {
    const cwd = makeCwd()
    mkdirSync(join(cwd, '.cursor'), { recursive: true })
    writeFileSync(
      join(cwd, '.cursor', 'mcp.json'),
      JSON.stringify({
        mcpServers: {
          other: { command: 'echo' },
          'morya-ui': { command: 'old' },
        },
      }),
      'utf8',
    )

    const skipped = mergeMcpConfig(cwd, { editors: ['cursor'] })
    const cursorSkip = skipped.results.find((r) => r.editor === 'cursor')
    assert.equal(cursorSkip.action, 'skipped')
    assert.equal(readJson(join(cwd, '.cursor', 'mcp.json')).mcpServers['morya-ui'].command, 'old')
    assert.ok(readJson(join(cwd, '.cursor', 'mcp.json')).mcpServers.other)

    const forced = mergeMcpConfig(cwd, { editors: ['cursor'], force: true })
    const cursorForce = forced.results.find((r) => r.editor === 'cursor')
    assert.equal(cursorForce.action, 'forced')
    const data = readJson(join(cwd, '.cursor', 'mcp.json'))
    assert.deepEqual(data.mcpServers['morya-ui'], SERVER_CONFIG)
    assert.ok(data.mcpServers.other)
  })

  it('merges Zed settings without wiping unrelated keys', () => {
    const cwd = makeCwd()
    mkdirSync(join(cwd, '.zed'), { recursive: true })
    writeFileSync(
      join(cwd, '.zed', 'settings.json'),
      JSON.stringify({
        theme: 'One Dark',
        context_servers: {
          other: { command: 'keep-me' },
        },
      }),
      'utf8',
    )

    const { results } = mergeMcpConfig(cwd, { editors: ['zed'] })
    assert.equal(results.find((r) => r.editor === 'zed').action, 'merged')

    const zed = readJson(join(cwd, '.zed', 'settings.json'))
    assert.equal(zed.theme, 'One Dark')
    assert.deepEqual(zed.context_servers.other, { command: 'keep-me' })
    assert.deepEqual(zed.context_servers['morya-ui'], SERVER_CONFIG)
  })

  it('respects editors subset and still writes portable', () => {
    const cwd = makeCwd()
    const { results } = mergeMcpConfig(cwd, { editors: ['vscode'] })
    assert.deepEqual(
      results.map((r) => r.editor),
      ['vscode', 'portable'],
    )
  })

  it('dry-run does not write files', () => {
    const cwd = makeCwd()
    const { results } = mergeMcpConfig(cwd, { dryRun: true })
    assert.ok(results.every((r) => r.action === 'created' && r.dryRun))
    assert.throws(() => readFileSync(join(cwd, '.cursor', 'mcp.json')), /ENOENT/)
    assert.throws(() => readFileSync(join(cwd, '.mcp.json')), /ENOENT/)
  })
})
