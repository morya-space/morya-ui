/**
 * Generates the built-in system icon registry for MIcon.
 *
 * All icons are sourced from Tabler (outline 24×24, stroke 2; a few filled
 * variants) via the Iconify API — the same backend the icons MCP uses.
 *
 * Usage:
 *   node scripts/generate-system-icons.mjs
 *
 * Behind a proxy (Node fetch does not use the system proxy by default):
 *   $env:NODE_USE_ENV_PROXY='1'; $env:HTTPS_PROXY='http://127.0.0.1:7897'
 *
 * To add an icon: append one line to SPEC below and re-run. Registry names
 * are stable public API — never rename or remove an existing name.
 *
 * Output: src/components/Icon/icons.ts
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Spec entry:
 *   ['name']                          → Tabler id = name
 *   ['name', 'tabler-id']             → renamed source
 *   ['name', { id, filled: true }]    → filled variant (fill currentColor, no stroke)
 *   ['name', { id, spin: true }]      → spinning icon (loader)
 *   ['name', { alias: 'other-name' }] → duplicate of another registry entry
 */
const GROUPS = [
  ['arrows', [
    ['chevron-up'],
    ['chevron-down'],
    ['chevron-left'],
    ['chevron-right'],
    ['chevrons-up'],
    ['chevrons-down'],
    ['chevrons-left'],
    ['chevrons-right'],
    ['selector'],
    ['triangle-up', { id: 'caret-up-filled', filled: true }],
    ['triangle-down', { id: 'caret-down-filled', filled: true }],
    ['arrow-up'],
    ['arrow-down'],
    ['arrow-left'],
    ['arrow-right'],
    ['arrow-narrow-up'],
    ['arrow-narrow-down'],
    ['arrow-up-right'],
    ['arrow-back-up'],
    ['arrow-forward-up'],
    ['corner-up-left'],
    ['corner-up-right'],
    ['undo', { alias: 'arrow-back-up' }],
    ['redo', { alias: 'arrow-forward-up' }],
    ['external-link'],
    ['logout'],
    ['login'],
    ['send'],
    ['share'],
    ['refresh'],
    ['rotate-clockwise'],
    ['rotate-2'],
    ['switch-horizontal'],
    ['sort', 'arrows-sort'],
    ['sort-ascending'],
    ['sort-descending'],
  ]],
  ['status', [
    ['check'],
    ['check-circle', 'circle-check'],
    ['close', 'x'],
    ['x-circle', 'circle-x'],
    ['info', 'info-circle'],
    ['info-circle'],
    ['warning', 'alert-triangle'],
    ['alert-circle'],
    ['help-circle'],
    ['ban'],
    ['circle-dashed'],
    ['loader', { id: 'loader-2', spin: true }],
    ['star'],
    ['heart'],
    ['sparkles'],
    ['rocket'],
    ['flag'],
    ['bookmark'],
    ['thumb-up'],
    ['thumb-down'],
    ['mood-smile'],
    ['bulb'],
    ['trophy'],
    ['flame'],
    ['crown'],
  ]],
  ['actions', [
    ['plus'],
    ['minus'],
    ['circle-plus'],
    ['search'],
    ['edit'],
    ['pencil'],
    ['trash'],
    ['copy'],
    ['download'],
    ['upload'],
    ['filter'],
    ['filter-off'],
    ['more', 'dots'],
    ['more-vertical', 'dots-vertical'],
    ['menu', 'menu-2'],
    ['grip', 'grip-vertical'],
    ['maximize', 'window-maximize'],
    ['restore', 'window-minimize'],
    ['zoom-in'],
    ['zoom-out'],
    ['save', { alias: 'device-floppy' }],
    ['device-floppy'],
    ['cut', { alias: 'scissors' }],
    ['scissors'],
    ['printer'],
    ['play', { alias: 'player-play' }],
    ['pause', { alias: 'player-pause' }],
    ['player-play'],
    ['player-pause'],
    ['clipboard'],
    ['clipboard-check'],
    ['clipboard-list'],
    ['paperclip'],
    ['history'],
    ['archive'],
    ['pin'],
    ['drag-drop'],
    ['wand'],
    ['bolt'],
    ['eraser'],
    ['tag'],
    ['tags'],
    ['list-check'],
    ['crop'],
    ['scan'],
    ['repeat'],
    ['power'],
    ['bold'],
    ['italic'],
    ['underline'],
    ['align-left'],
    ['align-center'],
    ['align-right'],
  ]],
  ['navigation', [
    ['home'],
    ['layout-dashboard'],
    ['layout-grid'],
    ['layout-list'],
    ['layout-cards'],
    ['layout-columns'],
    ['layout-kanban'],
    ['layout-sidebar-left-collapse'],
    ['layout-sidebar-right-collapse'],
    ['grid', { alias: 'layout-grid' }],
    ['list'],
    ['list-details'],
    ['table'],
    ['layers', 'stack-2'],
    ['stack'],
    ['sitemap'],
    ['settings'],
    ['sliders', { alias: 'adjustments-horizontal' }],
    ['adjustments-horizontal'],
    ['components'],
    ['puzzle'],
    ['apps'],
    ['palette'],
  ]],
  ['people', [
    ['user'],
    ['users'],
    ['user-plus'],
    ['user-circle'],
    ['user-check'],
    ['user-x'],
    ['user-minus'],
    ['user-search'],
    ['user-cog'],
    ['users-group'],
    ['id'],
  ]],
  ['files', [
    ['folder'],
    ['folder-open'],
    ['folder-plus'],
    ['folder-check'],
    ['folder-search'],
    ['folders'],
    ['file'],
    ['file-text'],
    ['file-plus'],
    ['file-check'],
    ['file-search'],
    ['file-download'],
    ['file-upload'],
    ['file-export'],
    ['file-import'],
    ['file-analytics'],
    ['file-invoice'],
    ['file-code'],
    ['file-zip'],
    ['file-type-pdf'],
    ['file-type-xls'],
    ['file-type-csv'],
    ['files'],
    ['book'],
    ['notebook'],
    ['report-search'],
    ['database'],
    ['box'],
    ['package'],
  ]],
  ['media', [
    ['photo'],
    ['image', { alias: 'photo' }],
    ['photo-plus'],
    ['photo-search'],
    ['camera'],
    ['video'],
    ['video-off'],
    ['microphone'],
    ['microphone-off'],
    ['music'],
    ['volume'],
    ['volume-off'],
    ['eye'],
    ['eye-off'],
  ]],
  ['devices', [
    ['device-desktop'],
    ['device-laptop'],
    ['device-tablet'],
    ['device-mobile'],
    ['keyboard'],
    ['mouse'],
    ['cpu'],
    ['battery-charging'],
    ['phone'],
    ['wifi'],
    ['wifi-off'],
    ['bluetooth'],
    ['server'],
    ['cloud'],
    ['terminal'],
    ['code'],
  ]],
  ['commerce', [
    ['shopping-cart'],
    ['shopping-cart-plus'],
    ['shopping-bag'],
    ['credit-card'],
    ['wallet'],
    ['currency-dollar'],
    ['currency-yuan'],
    ['receipt'],
    ['calculator'],
    ['briefcase'],
    ['building'],
    ['building-bank'],
    ['building-store'],
    ['truck-delivery'],
    ['packages'],
    ['map-pin'],
    ['world'],
  ]],
  ['charts', [
    ['chart-bar'],
    ['chart-line'],
    ['chart-pie'],
    ['chart-area'],
    ['chart-donut'],
    ['chart-histogram'],
    ['chart-candle'],
    ['activity'],
    ['trending-up'],
    ['trending-down'],
  ]],
  ['communication', [
    ['mail'],
    ['mail-open', 'mail-opened'],
    ['inbox'],
    ['message'],
    ['message-2'],
    ['message-circle'],
    ['messages'],
    ['bell'],
    ['bell-off'],
    ['bell-ringing'],
    ['phone-call'],
  ]],
  ['security', [
    ['lock'],
    ['unlock', 'lock-open'],
    ['lock-off'],
    ['link'],
    ['shield'],
    ['shield-check'],
    ['shield-x'],
    ['shield-lock'],
    ['key'],
    ['fingerprint'],
    ['certificate'],
  ]],
  ['weather', [
    ['sun'],
    ['moon'],
    ['moon-stars'],
    ['cloud-upload'],
    ['cloud-download'],
    ['calendar'],
    ['calendar-plus'],
    ['calendar-check'],
    ['calendar-time'],
    ['clock'],
    ['alarm'],
    ['hourglass'],
  ]],
]

// --- Resolve spec → flat entries ------------------------------------------
const byName = new Map()
const entries = []
for (const [group, icons] of GROUPS) {
  for (const [name, source] of icons) {
    if (byName.has(name)) throw new Error(`Duplicate registry name: ${name}`)
    const entry = { group, name }
    if (source == null) {
      entry.id = name
    } else if (typeof source === 'string') {
      entry.id = source
    } else if (source.alias) {
      entry.alias = source.alias
    } else {
      entry.id = source.id ?? name
      entry.filled = Boolean(source.filled)
      entry.spin = Boolean(source.spin)
    }
    byName.set(name, entry)
    entries.push(entry)
  }
}
for (const entry of entries) {
  if (!entry.alias) continue
  const target = byName.get(entry.alias)
  if (!target) throw new Error(`Alias ${entry.name} → unknown target ${entry.alias}`)
  if (target.alias) throw new Error(`Alias ${entry.name} → ${entry.alias} is itself an alias`)
  entry.id = target.id
  entry.filled = target.filled
}

// --- Fetch icon bodies from Iconify ----------------------------------------
const uniqueIds = [...new Set(entries.map((e) => e.id))]
console.log(`Fetching ${uniqueIds.length} Tabler icons for ${entries.length} registry entries…`)

const bodies = new Map()
const CHUNK = 60
for (let i = 0; i < uniqueIds.length; i += CHUNK) {
  const chunk = uniqueIds.slice(i, i + CHUNK)
  const url = `https://api.iconify.design/tabler.json?icons=${chunk.join(',')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${chunk[0]}…`)
  const json = await res.json()
  if (json.not_found?.length) throw new Error(`Unknown Tabler icons: ${json.not_found.join(', ')}`)
  for (const [id, icon] of Object.entries(json.icons)) bodies.set(id, icon.body)
}

// --- Parse bodies → path data ----------------------------------------------
const PATH_RE = /<path[^>]*?\sd="([^"]+)"/g
const FILL_RE = /<path[^>]*?\sfill="currentColor"/

function parseBody(id, body) {
  if (/<(circle|rect|line|polyline|polygon|ellipse)\b/.test(body)) {
    throw new Error(`${id}: unexpected non-path element in body`)
  }
  if (/transform=/.test(body)) throw new Error(`${id}: transform attribute not supported`)
  const paths = [...body.matchAll(PATH_RE)].map((m) => m[1])
  if (!paths.length) throw new Error(`${id}: no <path> found`)
  return { paths, filled: FILL_RE.test(body) }
}

const parsed = new Map()
for (const [id, body] of bodies) parsed.set(id, parseBody(id, body))

for (const entry of entries) {
  const { filled } = parsed.get(entry.id)
  if (Boolean(entry.filled) !== filled) {
    throw new Error(
      `${entry.name} (tabler:${entry.id}): filled flag mismatch — spec says ${Boolean(entry.filled)}, source says ${filled}`,
    )
  }
}

// --- Emit icons.ts -----------------------------------------------------------
function escapePath(d) {
  return d.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function keyOf(name) {
  return /^[$_a-z]\w*$/i.test(name) ? name : `'${name}'`
}

function formatEntry(entry) {
  const { paths } = parsed.get(entry.id)
  const helper = entry.spin ? 'spinIcon' : entry.filled ? 'tf' : 't'
  if (paths.length === 1) return `  ${keyOf(entry.name)}: ${helper}('${escapePath(paths[0])}'),`
  const body = paths.map((d) => `    '${escapePath(d)}',`).join('\n')
  return `  ${keyOf(entry.name)}: ${helper}(\n${body}\n  ),`
}

const header = `/**
 * Built-in system icons — all Tabler (outline 24×24, stroke 2; a few filled).
 * GENERATED by scripts/generate-system-icons.mjs — do not edit by hand.
 * App-specific icons → default slot (Lucide etc.), see docs.
 */
import type { IconDefinition, IconPrimitive } from './icons-types'

export type { IconDefinition, IconPrimitive } from './icons-types'

/** Tabler outline icon (24×24, stroke 2). */
function t(...paths: string[]): IconDefinition {
  return {
    viewBox: '0 0 24 24',
    strokeWidth: 2,
    primitives: paths.map(
      (d): IconPrimitive => ({ tag: 'path', d }),
    ),
  }
}

/** Tabler filled icon (24×24, fill currentColor, no stroke). */
function tf(...paths: string[]): IconDefinition {
  return {
    viewBox: '0 0 24 24',
    primitives: paths.map(
      (d): IconPrimitive => ({ tag: 'path', d, fill: 'currentColor', stroke: 'none' }),
    ),
  }
}

/** Spinning outline icon (loader). */
function spinIcon(...paths: string[]): IconDefinition {
  return { ...t(...paths), spin: true }
}

export const iconRegistry = {`

const lines = [header]
for (const [group, icons] of GROUPS) {
  lines.push(``, `  // ── ${group}`)
  for (const [name] of icons) lines.push(formatEntry(byName.get(name)))
}
lines.push(
  `} as const satisfies Record<string, IconDefinition>`,
  ``,
  `export type IconName = keyof typeof iconRegistry`,
  ``,
  `export const iconNames = Object.keys(iconRegistry) as IconName[]`,
  ``,
  `export function isIconName(value: string): value is IconName {`,
  `  return value in iconRegistry`,
  `}`,
  ``,
  `export function getIconDefinition(name: IconName): IconDefinition {`,
  `  return iconRegistry[name]`,
  `}`,
  ``,
)

const outPath = resolve(__dirname, '../src/components/Icon/icons.ts')
writeFileSync(outPath, lines.join('\n'), 'utf8')

for (const [group, icons] of GROUPS) console.log(`  ${group}: ${icons.length}`)
console.log(`Wrote ${entries.length} icons → ${outPath}`)
