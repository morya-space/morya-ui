import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { copyTemplate } from './copy-template.mjs'
import { readJson } from './fs-utils.mjs'
import { installMoryaUi } from './install.mjs'
import { mergeMcpConfig } from './mcp.mjs'
import { ensureCheckColorsScript } from './package-json.mjs'
import { ensureStylesImport } from './styles.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const TEMPLATE_ROOT = join(PKG_ROOT, 'template')

const MODES = new Set(['app', 'ai', 'full'])

/** AI pack paths under template/. */
const AI_TEMPLATE_INCLUDE = [
  'DESIGN.md',
  '.agents/skills/morya-ui-pages',
  '.cursor/rules',
  'docs',
  'scripts/check-raw-colors.mjs',
]

/** Mode → default skips (user --skip-* can only add more skips). */
const MODE_DEFAULTS = {
  full: {},
  app: { skipTemplate: true, skipMcp: true, skipScripts: true },
  ai: { skipInstall: true, skipStyles: true },
}

const SKIP_FLAGS = {
  '--skip-install': 'skipInstall',
  '--skip-template': 'skipTemplate',
  '--skip-mcp': 'skipMcp',
  '--skip-styles': 'skipStyles',
  '--skip-scripts': 'skipScripts',
}

export function printHelp() {
  console.log(`Usage: morya-ui-setup [command] [options]

Commands:
  (default) / full  Install morya-ui, AI template, MCP, styles, check:colors
  app               Install morya-ui and inject styles.css
  ai                Copy Agent skill / rules / DESIGN / docs,
                    merge Cursor MCP, add check:colors

Default command:
  - install morya-ui
  - copy DESIGN.md, Agent skill, Cursor rules, docs
  - merge .cursor/mcp.json for @morya-ui/mcp
  - inject import 'morya-ui/styles.css' into the app entry when found
  - add check:colors script when missing

Options:
  --cwd <dir>       Target project root (default: process.cwd())
  --pm <name>       Package manager: pnpm | yarn | npm (auto-detect by lockfile)
  --force           Overwrite existing template files and MCP server entry
  --dry-run         Print actions without writing or installing
  --skip-install    Skip dependency install
  --skip-template   Skip copying AI template files
  --skip-mcp        Skip writing .cursor/mcp.json
  --skip-styles     Skip injecting styles.css
  --skip-scripts    Skip adding check:colors to package.json
  -h, --help        Show this help
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
    force: false,
    dryRun: false,
    skipInstall: false,
    skipTemplate: false,
    skipMcp: false,
    skipStyles: false,
    skipScripts: false,
    help: false,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }
    if (MODES.has(arg)) {
      options.mode = arg
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
    if (SKIP_FLAGS[arg]) {
      options[SKIP_FLAGS[arg]] = true
      continue
    }
    if (arg === '--cwd') {
      const value = argv[++i]
      if (!value) throw new Error('--cwd requires a path')
      options.cwd = resolve(value)
      continue
    }
    if (arg.startsWith('--cwd=')) {
      options.cwd = resolve(arg.slice('--cwd='.length))
      continue
    }
    if (arg === '--pm') {
      const value = argv[++i]
      if (!value) throw new Error('--pm requires pnpm, yarn, or npm')
      options.pm = value
      continue
    }
    if (arg.startsWith('--pm=')) {
      options.pm = arg.slice('--pm='.length)
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

function rel(cwd, path) {
  if (!path) return ''
  return path.startsWith(cwd) ? path.slice(cwd.length).replace(/^[\\/]/, '') || path : path
}

/**
 * @param {string} cwd
 */
function hasMoryaUiDependency(cwd) {
  const path = join(cwd, 'package.json')
  if (!existsSync(path)) return false
  try {
    const pkg = readJson(path)
    return Boolean(
      pkg.dependencies?.['morya-ui']
      || pkg.devDependencies?.['morya-ui']
      || pkg.peerDependencies?.['morya-ui'],
    )
  } catch {
    return false
  }
}

/**
 * @param {ReturnType<typeof parseArgs>} options
 */
export async function runSetup(options) {
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
  } = options

  console.log(`@morya-ui/setup [${mode}] → ${cwd}${dryRun ? ' (dry-run)' : ''}`)
  console.log('')

  if (mode === 'ai' && !hasMoryaUiDependency(cwd)) {
    console.log(
      'Warning: morya-ui is not listed in package.json. Run `npx @morya-ui/setup app` first (or pnpm add morya-ui).',
    )
    console.log('')
  }

  const install = installMoryaUi(cwd, { pm, dryRun, skipInstall })

  const template = skipTemplate
    ? { copied: [], skipped: [], forced: [], skippedStep: true }
    : copyTemplate(TEMPLATE_ROOT, cwd, {
        force,
        dryRun,
        include: mode === 'ai' || mode === 'full' ? AI_TEMPLATE_INCLUDE : undefined,
      })

  const mcp = skipMcp
    ? { path: join(cwd, '.cursor', 'mcp.json'), action: 'skipped-flag' }
    : mergeMcpConfig(cwd, { force, dryRun })

  const styles = skipStyles
    ? { action: 'skipped', reason: 'skip-styles' }
    : ensureStylesImport(cwd, { dryRun })

  const scripts = skipScripts
    ? { action: 'skipped-flag' }
    : ensureCheckColorsScript(cwd, { force, dryRun })

  console.log('--- Summary ---')
  if (install.skipped) {
    console.log(`Install: skipped (${install.reason}) — would run: ${install.command}`)
  } else {
    console.log(`Install: ok (${install.pm}) — ${install.command}`)
  }

  if (template.skippedStep) {
    console.log('Template: skipped (--skip-template or app mode)')
  } else {
    console.log(
      `Template: ${template.copied.length} copied, ${template.forced.length} overwritten, ${template.skipped.length} skipped`,
    )
    if (template.skipped.length && template.skipped.length <= 8) {
      for (const file of template.skipped) console.log(`  skip ${file}`)
    } else if (template.skipped.length > 8) {
      for (const file of template.skipped.slice(0, 5)) console.log(`  skip ${file}`)
      console.log(`  … and ${template.skipped.length - 5} more (use --force to overwrite)`)
    }
  }

  if (mcp.action === 'skipped-flag') {
    console.log('MCP: skipped (--skip-mcp or app mode)')
  } else {
    console.log(`MCP: ${mcp.action} (${rel(cwd, mcp.path) || '.cursor/mcp.json'})`)
  }

  if (styles.reason === 'skip-styles') {
    console.log('Styles: skipped (--skip-styles or ai mode)')
  } else if (styles.action === 'injected') {
    console.log(`Styles: injected into ${rel(cwd, styles.path)}`)
  } else if (styles.action === 'skipped') {
    console.log(`Styles: skipped (${styles.reason}) in ${rel(cwd, styles.path)}`)
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
  if (mode === 'app') {
    console.log('  1. Ensure the styles.css import is in your app entry.')
    console.log('  2. Optional AI pack: npx @morya-ui/setup ai')
  } else if (mode === 'ai') {
    console.log('  1. Restart Cursor (or reload MCP) so morya-ui MCP tools appear.')
    console.log('  2. Have the agent read DESIGN.md before generating pages.')
    console.log('  3. Optional: pnpm check:colors')
  } else {
    console.log('  1. Ensure the styles.css import is in your app entry.')
    console.log('  2. Restart Cursor (or reload MCP) so morya-ui MCP tools appear.')
    console.log('  3. Have the agent read DESIGN.md before generating pages.')
    console.log('  4. Optional: pnpm check:colors')
  }

  return { mode, install, template, mcp, styles, scripts }
}
