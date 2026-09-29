import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'
import {
  DEFAULT_SKILL_AGENTS,
  extraSkillDirsForAgents,
  installSkillsCli,
  parseAgentsFlag,
  skillAgentCliFlags,
  syncProjectSkillsToAgents,
} from '../skills.mjs'

/** @type {string[]} */
const temps = []

function makeCwd() {
  const cwd = mkdtempSync(join(tmpdir(), 'morya-setup-skills-'))
  temps.push(cwd)
  return cwd
}

afterEach(() => {
  while (temps.length) {
    rmSync(temps.pop(), { recursive: true, force: true })
  }
})

function seedSkill(cwd, name) {
  const dir = join(cwd, '.agents', 'skills', name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: test\n---\n`, 'utf8')
  return dir
}

describe('parseAgentsFlag', () => {
  it('defaults to the five curated agents', () => {
    assert.deepEqual(parseAgentsFlag(), [...DEFAULT_SKILL_AGENTS])
    assert.deepEqual(parseAgentsFlag(''), [...DEFAULT_SKILL_AGENTS])
  })

  it('returns * for all', () => {
    assert.equal(parseAgentsFlag('all'), '*')
    assert.equal(parseAgentsFlag('*'), '*')
  })

  it('parses and dedupes a subset', () => {
    assert.deepEqual(parseAgentsFlag('zed,cursor,zed'), ['zed', 'cursor'])
  })

  it('rejects unknown agents', () => {
    assert.throws(() => parseAgentsFlag('cursor,not-a-real-agent'), /Unknown skill agent/)
  })
})

describe('skillAgentCliFlags', () => {
  it('emits one -a per default agent', () => {
    const flags = skillAgentCliFlags(DEFAULT_SKILL_AGENTS)
    assert.match(flags, /-a cursor/)
    assert.match(flags, /-a github-copilot/)
    assert.match(flags, /-a zed/)
    assert.match(flags, /-a claude-code/)
    assert.match(flags, /-a windsurf/)
  })

  it('emits wildcard for all', () => {
    assert.equal(skillAgentCliFlags('*'), "-a '*'")
  })
})

describe('extraSkillDirsForAgents', () => {
  it('mirrors claude / windsurf / github dirs for defaults', () => {
    assert.deepEqual(extraSkillDirsForAgents(DEFAULT_SKILL_AGENTS), [
      '.github/skills',
      '.claude/skills',
      '.windsurf/skills',
    ])
  })

  it('skips extras for agents that only use .agents/skills', () => {
    assert.deepEqual(extraSkillDirsForAgents(['cursor', 'zed']), [])
  })
})

describe('installSkillsCli', () => {
  it('dry-run builds multi-agent commands', () => {
    const cwd = makeCwd()
    const skills = [
      {
        id: 'frontend-design',
        name: 'Frontend Design',
        description: 'x',
        install: 'skills-cli',
        source: 'anthropics/skills',
        skill: 'frontend-design',
        path: '.agents/skills/frontend-design',
      },
    ]
    const result = installSkillsCli(cwd, ['frontend-design'], skills, {
      dryRun: true,
      agents: ['cursor', 'zed', 'github-copilot'],
    })
    assert.equal(result.dryRun, true)
    assert.equal(result.commands.length, 1)
    assert.match(result.commands[0], /skills add anthropics\/skills/)
    assert.match(result.commands[0], /-s frontend-design/)
    assert.match(result.commands[0], /-a cursor/)
    assert.match(result.commands[0], /-a zed/)
    assert.match(result.commands[0], /-a github-copilot/)
    assert.doesNotMatch(result.commands[0], /-a cursor -y$/)
  })
})

describe('syncProjectSkillsToAgents', () => {
  it('links into claude / windsurf / github skill dirs', () => {
    const cwd = makeCwd()
    seedSkill(cwd, 'morya-ui-pages')

    const { results } = syncProjectSkillsToAgents(cwd, ['morya-ui-pages'], {
      agents: DEFAULT_SKILL_AGENTS,
    })

    const byDir = Object.fromEntries(results.map((r) => [r.dir, r]))
    assert.ok(byDir['.claude/skills'])
    assert.ok(byDir['.windsurf/skills'])
    assert.ok(byDir['.github/skills'])
    assert.ok(['linked', 'copied'].includes(byDir['.claude/skills'].action))

    assert.ok(readFileSync(join(cwd, '.claude', 'skills', 'morya-ui-pages', 'SKILL.md'), 'utf8'))
    assert.ok(readFileSync(join(cwd, '.windsurf', 'skills', 'morya-ui-pages', 'SKILL.md'), 'utf8'))
    assert.ok(readFileSync(join(cwd, '.github', 'skills', 'morya-ui-pages', 'SKILL.md'), 'utf8'))
  })

  it('skips existing links unless force', () => {
    const cwd = makeCwd()
    seedSkill(cwd, 'morya-ui-pages')
    mkdirSync(join(cwd, '.claude', 'skills', 'morya-ui-pages'), { recursive: true })
    writeFileSync(join(cwd, '.claude', 'skills', 'morya-ui-pages', 'SKILL.md'), 'old\n', 'utf8')

    const skipped = syncProjectSkillsToAgents(cwd, ['morya-ui-pages'], {
      agents: ['claude-code'],
    })
    assert.equal(skipped.results[0].action, 'skipped')
    assert.equal(
      readFileSync(join(cwd, '.claude', 'skills', 'morya-ui-pages', 'SKILL.md'), 'utf8'),
      'old\n',
    )

    const forced = syncProjectSkillsToAgents(cwd, ['morya-ui-pages'], {
      agents: ['claude-code'],
      force: true,
    })
    assert.ok(['linked', 'copied'].includes(forced.results[0].action))
    assert.match(
      readFileSync(join(cwd, '.claude', 'skills', 'morya-ui-pages', 'SKILL.md'), 'utf8'),
      /morya-ui-pages/,
    )
  })

  it('dry-run does not create dirs', () => {
    const cwd = makeCwd()
    seedSkill(cwd, 'morya-ui-pages')
    const { results } = syncProjectSkillsToAgents(cwd, ['morya-ui-pages'], {
      agents: ['claude-code'],
      dryRun: true,
    })
    assert.equal(results[0].action, 'linked')
    assert.throws(
      () => readFileSync(join(cwd, '.claude', 'skills', 'morya-ui-pages', 'SKILL.md')),
      /ENOENT/,
    )
  })
})
