import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyTemplate } from './copy-template.mjs'
import { detectPackageManager, installMoryaUi } from './install.mjs'
import { DEFAULT_EDITORS, mergeMcpConfig, parseEditorsFlag } from './mcp.mjs'
import { ensureCheckColorsScript } from './package-json.mjs'
import { canPrompt, selectOption, textInput } from './prompt.mjs'
import { isValidProjectName, projectNameError, scaffoldProject } from './scaffold.mjs'
import {
  buildAiInclude,
  DEFAULT_SKILL_AGENTS,
  installSkillsCli,
  listCanonicalSkillFolders,
  loadSkillsCatalog,
  parseAgentsFlag,
  parseSkillsFlag,
  resolveSkillAgents,
  resolveSkillSelection,
  skillFolderNames,
  syncProjectSkillsToAgents,
} from './skills.mjs'
import { ensureStylesImport } from './styles.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const TEMPLATE_ROOT = join(PKG_ROOT, 'template')

const MODES = new Set(['app', 'ai', 'full'])

/** Mode → default skips (user --skip-* can only add more skips). */
const MODE_DEFAULTS = {
  full: {},
  app: { skipTemplate: true, skipMcp: true, skipScripts: true },
  // ai still upgrades morya-ui / @morya-ui/* to latest unless --skip-install
  ai: { skipStyles: true },
}

const SKIP_FLAGS = {
  '--skip-install': 'skipInstall',
  '--skip-template': 'skipTemplate',
  '--skip-mcp': 'skipMcp',
  '--skip-styles': 'skipStyles',
  '--skip-scripts': 'skipScripts',
}

export function printHelp() {
  const { skills } = loadSkillsCatalog()
  const skillList = skills.map((s) => {
    const tag = s.required ? 'required' : s.default ? 'default' : 'optional'
    const via = s.install === 'skills-cli' ? ' [skills-cli latest]' : ''
    return `    ${s.id.padEnd(24)} (${tag})${via} ${s.description}`
  }).join('\n')

  console.log(`Usage: morya-ui-setup [command] [options]

Commands:
  (default) / full  Upgrade morya packages to latest, AI template, MCP, styles, check:colors
  app               Upgrade morya packages to latest and inject styles.css
  ai                Upgrade morya packages to latest, copy Agent skills / rules / DESIGN,
                    merge MCP for Cursor / VS Code / Zed, add check:colors

Default command:
  - install / upgrade morya-ui@latest and any existing @morya-ui/* to @latest
  - copy DESIGN.md, AGENTS.md, selected Agent skills, Cursor rules
  - install companion skills + sync into multi-agent skill dirs
  - merge MCP configs for @morya-ui/mcp@latest (Cursor, VS Code, Zed, + .mcp.json)
  - inject import 'morya-ui/styles.css' into the app entry when found
  - add check:colors script when missing

Create a new project (add --create):
  morya-ui-setup --create my-app
  - scaffold a fresh Vite Vue app via create-vite into ./my-app
  - run <pm> install, then apply the full setup (deps + AI + MCP + styles)

Interactive mode (TTY):
  Run without arguments in a terminal and the CLI will prompt for:
    - what to do (configure current project / create new project)
    - project name + template when creating
    - package manager (auto-detected default)
    - optional Agent skills
  Pass --yes to skip every prompt and use defaults (CI-friendly).

Options:
  --create <name>   Scaffold a new project via create-vite, then run full setup inside
  --template <tpl>  create-vite template: vue-ts (default) | vue
  --cwd <dir>       Target project root (default: process.cwd()); with --create, the parent dir
  --pm <name>       Package manager: pnpm | yarn | npm (auto-detect by lockfile, else pnpm)
  --skills <list>   Comma-separated skill ids, or "all" (skips interactive prompt)
  --editors <list>  MCP targets: cursor,vscode,zed (default: all); always also writes .mcp.json
  --agents <list>   Skill agents: cursor,github-copilot,zed,claude-code,windsurf (default), or all
  --yes             Use default skills without prompting (CI / non-interactive)
  --force           Overwrite existing template files, MCP entry, and skill dir links
  --dry-run         Print actions without writing or installing
  --skip-install    Skip dependency install / upgrade
  --skip-template   Skip copying AI template files
  --skip-mcp        Skip writing editor MCP configs and .mcp.json
  --skip-styles     Skip injecting styles.css
  --skip-scripts    Skip adding check:colors to package.json
  -h, --help        Show this help

Skills:
${skillList}
`)
}

/**
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  const options = {
    mode: 'full',
    cwd: process.cwd(),
    pm: undefined,
    skills: undefined,
    editors: undefined,
    agents: undefined,
    create: undefined,
    template: undefined,
    yes: false,
    force: false,
    dryRun: false,
    skipInstall: false,
    skipTemplate: false,
    skipMcp: false,
    skipStyles: false,
    skipScripts: false,
    help: false,
    /** Tracks which flags the user passed explicitly (for interactive prompts). */
    explicit: {
      mode: false,
      cwd: false,
      pm: false,
      skills: false,
      editors: false,
      agents: false,
      create: false,
      template: false,
    },
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }
    if (MODES.has(arg)) {
      options.mode = arg
      options.explicit.mode = true
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--yes' || arg === '-y') {
      options.yes = true
      continue
    }
    if (SKIP_FLAGS[arg]) {
      options[SKIP_FLAGS[arg]] = true
      continue
    }
    if (arg === '--cwd') {
      const value = argv[++i]
      if (!value) throw new Error('--cwd requires a path')
      options.cwd = resolve(value)
      options.explicit.cwd = true
      continue
    }
    if (arg.startsWith('--cwd=')) {
      options.cwd = resolve(arg.slice('--cwd='.length))
      options.explicit.cwd = true
      continue
    }
    if (arg === '--create') {
      // Bare --create → interactive prompt for name; --create <name> → explicit.
      const next = argv[i + 1]
      if (next && !next.startsWith('-')) {
        options.create = next
        i++
      } else {
        options.create = true // marker: ask interactively
      }
      options.explicit.create = true
      continue
    }
    if (arg.startsWith('--create=')) {
      const value = arg.slice('--create='.length)
      options.create = value || true // empty → marker for interactive prompt
      options.explicit.create = true
      continue
    }
    if (arg === '--template') {
      const value = argv[++i]
      if (!value) throw new Error('--template requires vue-ts or vue')
      options.template = value
      options.explicit.template = true
      continue
    }
    if (arg.startsWith('--template=')) {
      options.template = arg.slice('--template='.length)
      options.explicit.template = true
      continue
    }
    if (arg === '--pm') {
      const value = argv[++i]
      if (!value) throw new Error('--pm requires pnpm, yarn, or npm')
      options.pm = value
      options.explicit.pm = true
      continue
    }
    if (arg.startsWith('--pm=')) {
      options.pm = arg.slice('--pm='.length)
      options.explicit.pm = true
      continue
    }
    if (arg === '--skills') {
      const value = argv[++i]
      if (!value) throw new Error('--skills requires a comma-separated list or "all"')
      options.skills = value
      options.explicit.skills = true
      continue
    }
    if (arg.startsWith('--skills=')) {
      options.skills = arg.slice('--skills='.length)
      options.explicit.skills = true
      continue
    }
    if (arg === '--editors') {
      const value = argv[++i]
      if (!value) throw new Error('--editors requires a comma-separated list or "all"')
      options.editors = value
      options.explicit.editors = true
      continue
    }
    if (arg.startsWith('--editors=')) {
      options.editors = arg.slice('--editors='.length)
      options.explicit.editors = true
      continue
    }
    if (arg === '--agents') {
      const value = argv[++i]
      if (!value) throw new Error('--agents requires a comma-separated list or "all"')
      options.agents = value
      options.explicit.agents = true
      continue
    }
    if (arg.startsWith('--agents=')) {
      options.agents = arg.slice('--agents='.length)
      options.explicit.agents = true
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  const defaults = MODE_DEFAULTS[options.mode] || {}
  for (const [key, value] of Object.entries(defaults)) {
    if (value) options[key] = true
  }

  return options
}

/**
 * Whether the user explicitly said what to do: a mode positional, or
 * --create with an actual name. Bare --create (no name yet) does NOT count.
 * @param {ReturnType<typeof parseArgs>} options
 */
function hasExplicitIntent(options) {
  return options.explicit.mode
    || (options.explicit.create && typeof options.create === 'string' && options.create.length > 0)
}

/**
 * Interactive pre-flight: ask what the user wants to do when no explicit
 * intent was given, and fill in --create / --template / --pm when creating.
 * Mutates and returns `options`.
 * @param {ReturnType<typeof parseArgs>} options
 */
async function resolveInteractively(options) {
  const interactive = canPrompt(options)

  // Phase A: what to do (only when no mode / --create was passed)
  if (interactive && !hasExplicitIntent(options)) {
    const action = await selectOption('What do you want to do?', [
      { value: 'full', label: 'Configure current project', hint: 'install / upgrade + AI pack + MCP + styles' },
      { value: 'create', label: 'Create a new project', hint: 'create-vite scaffold + full setup' },
    ], { default: 'full' })
    if (action === 'create') {
      options.create = true // marker; actual name asked next
    } else {
      options.mode = action
      // re-apply mode defaults in case mode changed from 'full'
      const defaults = MODE_DEFAULTS[options.mode] || {}
      for (const [key, value] of Object.entries(defaults)) {
        if (value) options[key] = true
      }
    }
  }

  // Phase B: project name when creating (bare --create or --create= with empty value)
  if (options.create === true || options.create === '') {
    if (!interactive) {
      throw new Error('--create requires a project name. Usage: --create <name> or --create=<name>')
    }
    options.create = await textInput('Project name', {
      validate: (value) => projectNameError(value),
    })
  }

  // Phase C: package manager (only when creating; otherwise auto-detect is fine)
  if (interactive && options.create && !options.explicit.pm) {
    const detected = detectPackageManager(options.cwd, undefined)
    options.pm = await selectOption('Package manager:', [
      { value: 'pnpm', label: 'pnpm', hint: detected === 'pnpm' ? 'detected' : undefined },
      { value: 'npm', label: 'npm', hint: detected === 'npm' ? 'detected' : undefined },
      { value: 'yarn', label: 'yarn', hint: detected === 'yarn' ? 'detected' : undefined },
    ], { default: detected })
  }

  return options
}

function rel(cwd, path) {
  if (!path) return ''
  return path.startsWith(cwd) ? path.slice(cwd.length).replace(/^[\\/]/, '') || path : path
}

/**
 * @param {ReturnType<typeof parseArgs>} rawOptions
 */
export async function runSetup(rawOptions) {
  const options = await resolveInteractively(rawOptions)
  const {
    mode,
    cwd,
    force,
    dryRun,
    skipInstall,
    skipTemplate,
    skipMcp,
    skipStyles,
    skipScripts,
    pm,
    skills: skillsFlag,
    editors: editorsFlag,
    agents: agentsFlag,
    yes,
    create,
    template,
  } = options

  // Phase 0: scaffold a new project when --create is passed.
  let scaffold = null
  let targetCwd = cwd
  let resolvedPm = pm
  if (create) {
    if (mode !== 'full') {
      throw new Error(`--create cannot be combined with mode "${mode}"; run without a mode (full).`)
    }
    if (!resolvedPm) resolvedPm = detectPackageManager(cwd, undefined)
    scaffold = await scaffoldProject(cwd, create, {
      pm: resolvedPm,
      template,
      dryRun,
      interactive: canPrompt(options) && !options.explicit.template,
    })
    targetCwd = scaffold.cwd
  }

  const editors = editorsFlag != null ? parseEditorsFlag(editorsFlag) : [...DEFAULT_EDITORS]
  const agents = agentsFlag != null ? parseAgentsFlag(agentsFlag) : [...DEFAULT_SKILL_AGENTS]
  const agentsLabel = agents === '*' ? 'all (*)' : resolveSkillAgents(agents).join(',')

  console.log(`@morya-ui/setup [${mode}] → ${targetCwd}${dryRun ? ' (dry-run)' : ''}`)
  if (scaffold) {
    console.log(`Scaffold: create-vite ${create} (template: ${scaffold.template}, pm: ${resolvedPm})`)
  }
  console.log('')

  const catalog = loadSkillsCatalog()
  let selectedSkills = []
  let aiInclude

  const needsTemplate = !skipTemplate && (mode === 'ai' || mode === 'full')
  if (needsTemplate) {
    if (skillsFlag != null) {
      selectedSkills = parseSkillsFlag(skillsFlag, catalog.skills)
    } else {
      selectedSkills = await resolveSkillSelection(catalog.skills, {
        skipPrompt: yes || dryRun,
      })
    }
    aiInclude = buildAiInclude(selectedSkills, catalog.skills)
    console.log(`Skills: ${selectedSkills.join(', ')}`)
    console.log(`Skill agents: ${agentsLabel}`)
    console.log('')
  }

  // Always ensure morya-ui@latest; also bump any existing @morya-ui/* (nuxt, mcp, …).
  const install = installMoryaUi(targetCwd, { pm: resolvedPm, dryRun, skipInstall, ensureCore: true })

  const template_ = skipTemplate
    ? { copied: [], skipped: [], forced: [], skippedStep: true }
    : copyTemplate(TEMPLATE_ROOT, targetCwd, {
        force,
        dryRun,
        include: aiInclude,
      })

  const remoteSkills = skipTemplate || !selectedSkills.length
    ? { installed: [], commands: [], agents, skipped: true }
    : installSkillsCli(targetCwd, selectedSkills, catalog.skills, { dryRun, agents })

  const skillNamesForSync = needsTemplate
    ? [
        ...new Set([
          ...skillFolderNames(selectedSkills, catalog.skills),
          ...(dryRun ? [] : listCanonicalSkillFolders(targetCwd)),
        ]),
      ]
    : []

  const skillSync = skipTemplate || !skillNamesForSync.length
    ? { results: [], skipped: true }
    : syncProjectSkillsToAgents(targetCwd, skillNamesForSync, { force, dryRun, agents })

  const mcp = skipMcp
    ? { skipped: true, results: [] }
    : mergeMcpConfig(targetCwd, { force, dryRun, editors })

  const styles = skipStyles
    ? { action: 'skipped', reason: 'skip-styles' }
    : ensureStylesImport(targetCwd, { dryRun })

  const scripts = skipScripts
    ? { action: 'skipped-flag' }
    : ensureCheckColorsScript(targetCwd, { force, dryRun })

  console.log('--- Summary ---')
  if (scaffold) {
    if (scaffold.skipped) {
      console.log(`Scaffold: skipped (${scaffold.reason}) — would run: ${scaffold.command}`)
      console.log(`  then: ${scaffold.installCommand}`)
    } else {
      console.log(`Scaffold: create-vite ${create} (template: ${scaffold.template})`)
      console.log(`  $ ${scaffold.command}`)
      console.log(`  $ ${scaffold.installCommand}`)
    }
  }
  const pkgList = (install.packages || []).join(', ') || 'morya-ui'
  if (install.skipped) {
    console.log(`Install: skipped (${install.reason}) — would run: ${install.command}`)
  } else {
    console.log(`Install: upgraded to latest (${install.pm}) — ${pkgList}`)
    console.log(`  $ ${install.command}`)
  }

  if (template_.skippedStep) {
    console.log('Template: skipped (--skip-template or app mode)')
  } else {
    console.log(
      `Template: ${template_.copied.length} copied, ${template_.forced.length} overwritten, ${template_.skipped.length} skipped`,
    )
    if (selectedSkills.length) console.log(`  skills: ${selectedSkills.join(', ')}`)
    if (template_.skipped.length && template_.skipped.length <= 8) {
      for (const file of template_.skipped) console.log(`  skip ${file}`)
    } else if (template_.skipped.length > 8) {
      for (const file of template_.skipped.slice(0, 5)) console.log(`  skip ${file}`)
      console.log(`  … and ${template_.skipped.length - 5} more (use --force to overwrite)`)
    }
  }

  if (remoteSkills.skipped) {
    // no companions selected or template step skipped
  } else if (remoteSkills.dryRun) {
    console.log(`Skills CLI: dry-run — would install ${remoteSkills.installed.join(', ')} → ${agentsLabel}`)
    for (const command of remoteSkills.commands) console.log(`  $ ${command}`)
  } else {
    console.log(`Skills CLI: installed ${remoteSkills.installed.join(', ')} (latest) → ${agentsLabel}`)
  }

  if (skillSync.skipped) {
    // nothing to mirror
  } else {
    const linked = skillSync.results.filter((r) => r.action === 'linked' || r.action === 'copied')
    const skippedLinks = skillSync.results.filter((r) => r.action === 'skipped')
    console.log(
      `Skill dirs: ${linked.length} linked/copied, ${skippedLinks.length} skipped${skillSync.dryRun ? ' (dry-run)' : ''}`,
    )
    for (const entry of skillSync.results.slice(0, 8)) {
      console.log(`  ${entry.action} ${entry.dir}/${entry.skill}`)
    }
    if (skillSync.results.length > 8) {
      console.log(`  … and ${skillSync.results.length - 8} more`)
    }
  }

  if (mcp.skipped) {
    console.log('MCP: skipped (--skip-mcp or app mode)')
  } else {
    console.log(`MCP: editors=${editors.join(',')}+portable`)
    for (const entry of mcp.results) {
      console.log(`  ${entry.editor}: ${entry.action} (${rel(targetCwd, entry.path)})`)
    }
  }

  if (styles.reason === 'skip-styles') {
    console.log('Styles: skipped (--skip-styles or ai mode)')
  } else if (styles.action === 'injected') {
    console.log(`Styles: injected into ${rel(targetCwd, styles.path)}`)
  } else if (styles.action === 'skipped') {
    console.log(`Styles: skipped (${styles.reason}) in ${rel(targetCwd, styles.path)}`)
  } else {
    console.log('Styles: no entry file found — add manually:')
    console.log("  import 'morya-ui/styles.css'")
  }

  if (scripts.action === 'skipped-flag') {
    console.log('Scripts: skipped (--skip-scripts or app mode)')
  } else {
    console.log(`Scripts: check:colors ${scripts.action}`)
  }

  console.log('')
  console.log('Next:')
  if (scaffold) {
    console.log(`  1. cd ${create}`)
    console.log(`  2. ${resolvedPm} dev`)
    console.log('  3. Restart / reload MCP in your editor so morya-ui tools appear.')
    console.log('  4. Have the agent read DESIGN.md (and AGENTS.md) before generating pages.')
  } else if (mode === 'app') {
    console.log('  1. Ensure the styles.css import is in your app entry.')
    console.log('  2. Optional AI pack: npx @morya-ui/setup ai')
  } else if (mode === 'ai') {
    console.log('  1. Restart / reload MCP in your editor so morya-ui tools appear.')
    console.log('  2. Have the agent read DESIGN.md (and AGENTS.md) before generating pages.')
    console.log('  3. Optional: pnpm check:colors')
  } else {
    console.log('  1. Ensure the styles.css import is in your app entry.')
    console.log('  2. Restart / reload MCP in your editor so morya-ui tools appear.')
    console.log('  3. Have the agent read DESIGN.md (and AGENTS.md) before generating pages.')
    console.log('  4. Optional: pnpm check:colors')
  }

  return {
    mode,
    scaffold,
    install,
    template: template_,
    remoteSkills,
    skillSync,
    mcp,
    styles,
    scripts,
    skills: selectedSkills,
    editors,
    agents,
  }
}

// Re-export for tests / external use.
export { isValidProjectName }
