/**
 * Generates the built-in system icon registry for MIcon.
 *
 * All icons are filled (Google Material Icons baseline, 24×24,
 * fill="currentColor") sourced via the Iconify API — the same backend the
 * icons MCP uses. Filled shapes stay crisp at small sizes where stroke
 * icons (Tabler/Lucide at 14–16px ≈ 1.2px stroke) turn fuzzy and break.
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
 *   ['name']                        → Material id resolved via IC_ID below
 *   ['name', 'material-id']         → explicit Material id (overrides IC_ID)
 *   ['name', { id, spin: true }]    → spinning icon (loader)
 *   ['name', { alias: 'other' }]    → duplicate of another registry entry
 *
 * Registry names keep the historical Tabler-style naming (public API);
 * IC_ID maps each name to its Material Icons source id.
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
    ['triangle-up'],
    ['triangle-down'],
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
    ['sort'],
    ['sort-ascending'],
    ['sort-descending'],
  ]],
  ['status', [
    ['check'],
    ['check-circle'],
    ['close'],
    ['x-circle'],
    ['info'],
    ['info-circle'],
    ['warning'],
    ['alert-circle'],
    ['help-circle'],
    ['ban'],
    ['circle-dashed'],
    ['loader', { id: 'autorenew', spin: true }],
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
    ['more'],
    ['more-vertical'],
    ['menu'],
    ['grip'],
    ['maximize'],
    ['restore'],
    ['zoom-in'],
    ['zoom-out'],
    ['save'],
    ['device-floppy'],
    ['cut'],
    ['scissors'],
    ['printer'],
    ['play'],
    ['pause'],
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
    ['layers'],
    ['stack'],
    ['sitemap'],
    ['settings'],
    ['sliders'],
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
    ['mail-open'],
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
    ['unlock'],
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

/**
 * Registry name → Material Icons (`ic:baseline-*`) source id.
 * Names identical in both sets are omitted (identity mapping).
 */
const IC_ID = {
  // arrows
  'chevron-up': 'keyboard-arrow-up',
  'chevron-down': 'keyboard-arrow-down',
  'chevrons-up': 'keyboard-double-arrow-up',
  'chevrons-down': 'keyboard-double-arrow-down',
  'chevrons-left': 'first-page',
  'chevrons-right': 'last-page',
  selector: 'unfold-more',
  'triangle-up': 'arrow-drop-up',
  'triangle-down': 'arrow-drop-down',
  'arrow-up': 'arrow-upward',
  'arrow-down': 'arrow-downward',
  'arrow-left': 'arrow-back',
  'arrow-right': 'arrow-forward',
  'arrow-narrow-up': 'arrow-upward',
  'arrow-narrow-down': 'arrow-downward',
  'arrow-up-right': 'north-east',
  'arrow-back-up': 'undo',
  'arrow-forward-up': 'redo',
  'corner-up-left': 'turn-left',
  'corner-up-right': 'turn-right',
  'external-link': 'open-in-new',
  logout: 'logout',
  login: 'login',
  'rotate-clockwise': 'rotate-right',
  'rotate-2': 'rotate-left',
  'switch-horizontal': 'swap-horiz',
  'sort-ascending': 'arrow-drop-up',
  'sort-descending': 'arrow-drop-down',
  // status
  'check-circle': 'check-circle',
  close: 'close',
  'x-circle': 'cancel',
  'info-circle': 'info',
  warning: 'warning',
  'alert-circle': 'error',
  'help-circle': 'help',
  ban: 'block',
  'circle-dashed': 'adjust',
  'circle-plus': 'add-circle',
  heart: 'favorite',
  sparkles: 'auto-awesome',
  'mood-smile': 'mood',
  bulb: 'lightbulb',
  trophy: 'emoji-events',
  flame: 'local-fire-department',
  crown: 'workspace-premium',
  // actions
  plus: 'add',
  pencil: 'create',
  trash: 'delete',
  copy: 'content-copy',
  'filter-off': 'filter-alt-off',
  more: 'more-horiz',
  'more-vertical': 'more-vert',
  grip: 'drag-indicator',
  maximize: 'fullscreen',
  restore: 'fullscreen-exit',
  save: 'save',
  'device-floppy': 'save',
  cut: 'content-cut',
  scissors: 'content-cut',
  printer: 'print',
  play: 'play-arrow',
  'player-play': 'play-arrow',
  'player-pause': 'pause',
  clipboard: 'assignment',
  'clipboard-check': 'assignment-turned-in',
  'clipboard-list': 'assignment',
  paperclip: 'attach-file',
  'drag-drop': 'open-with',
  wand: 'auto-fix-high',
  eraser: 'auto-fix-normal',
  tags: 'sell',
  'list-check': 'fact-check',
  scan: 'document-scanner',
  bold: 'format-bold',
  italic: 'format-italic',
  underline: 'format-underlined',
  'align-left': 'format-align-left',
  'align-center': 'format-align-center',
  'align-right': 'format-align-right',
  // navigation
  'layout-dashboard': 'dashboard',
  'layout-grid': 'grid-view',
  'layout-list': 'view-list',
  'layout-cards': 'view-agenda',
  'layout-columns': 'view-column',
  'layout-kanban': 'view-kanban',
  'layout-sidebar-left-collapse': 'first-page',
  'layout-sidebar-right-collapse': 'last-page',
  'list-details': 'view-list',
  table: 'table-chart',
  layers: 'layers',
  stack: 'layers',
  sitemap: 'account-tree',
  sliders: 'tune',
  'adjustments-horizontal': 'tune',
  components: 'widgets',
  puzzle: 'extension',
  // people
  user: 'person',
  users: 'people',
  'user-plus': 'person-add',
  'user-circle': 'account-circle',
  'user-check': 'how-to-reg',
  'user-x': 'person-off',
  'user-minus': 'person-remove',
  'user-search': 'person-search',
  'user-cog': 'manage-accounts',
  'users-group': 'groups',
  id: 'badge',
  // files
  'folder-plus': 'create-new-folder',
  'folder-check': 'folder-shared',
  'folder-search': 'folder-shared',
  folders: 'folder-copy',
  file: 'insert-drive-file',
  'file-text': 'description',
  'file-plus': 'note-add',
  'file-check': 'task',
  'file-search': 'find-in-page',
  'file-export': 'file-upload',
  'file-import': 'file-download',
  'file-analytics': 'assessment',
  'file-invoice': 'receipt-long',
  'file-code': 'code',
  'file-zip': 'folder-zip',
  'file-type-pdf': 'picture-as-pdf',
  'file-type-xls': 'grid-on',
  'file-type-csv': 'grid-on',
  files: 'file-copy',
  notebook: 'menu-book',
  'report-search': 'find-in-page',
  database: 'storage',
  box: 'inventory-2',
  package: 'inventory-2',
  // media
  photo: 'image',
  'photo-plus': 'add-photo-alternate',
  'photo-search': 'image-search',
  video: 'videocam',
  'video-off': 'videocam-off',
  microphone: 'mic',
  'microphone-off': 'mic-off',
  music: 'music-note',
  volume: 'volume-up',
  eye: 'visibility',
  'eye-off': 'visibility-off',
  // devices
  'device-desktop': 'desktop-windows',
  'device-laptop': 'laptop',
  'device-tablet': 'tablet',
  'device-mobile': 'smartphone',
  cpu: 'memory',
  'battery-charging': 'battery-charging-full',
  server: 'dns',
  // commerce
  'shopping-cart-plus': 'add-shopping-cart',
  'currency-dollar': 'attach-money',
  calculator: 'calculate',
  briefcase: 'work',
  building: 'apartment',
  'building-bank': 'account-balance',
  'building-store': 'storefront',
  'truck-delivery': 'local-shipping',
  packages: 'inventory-2',
  'map-pin': 'place',
  world: 'public',
  // charts
  'chart-bar': 'bar-chart',
  'chart-line': 'show-chart',
  'chart-pie': 'pie-chart',
  'chart-area': 'area-chart',
  'chart-donut': 'donut-large',
  'chart-histogram': 'bar-chart',
  'chart-candle': 'candlestick-chart',
  activity: 'monitor-heart',
  // communication
  'mail-open': 'drafts',
  message: 'message',
  'message-2': 'chat-bubble',
  'message-circle': 'chat-bubble',
  messages: 'forum',
  bell: 'notifications',
  'bell-off': 'notifications-off',
  'bell-ringing': 'notification-important',
  'phone-call': 'call',
  // security
  unlock: 'lock-open',
  'lock-off': 'no-encryption',
  'shield-check': 'verified-user',
  'shield-x': 'gpp-bad',
  'shield-lock': 'lock',
  certificate: 'verified',
  // weather / time
  sun: 'light-mode',
  moon: 'dark-mode',
  'moon-stars': 'nights-stay',
  calendar: 'calendar-today',
  'calendar-plus': 'event',
  'calendar-check': 'event-available',
  'calendar-time': 'schedule',
  clock: 'access-time',
  hourglass: 'hourglass-empty',
}

// --- Resolve spec → flat entries ------------------------------------------
const byName = new Map()
const entries = []
for (const [group, icons] of GROUPS) {
  for (const [name, source] of icons) {
    if (byName.has(name)) throw new Error(`Duplicate registry name: ${name}`)
    const entry = { group, name }
    if (source == null) {
      entry.id = IC_ID[name] ?? name
    } else if (typeof source === 'string') {
      entry.id = source
    } else if (source.alias) {
      entry.alias = source.alias
    } else {
      entry.id = source.id ?? IC_ID[name] ?? name
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
}

// --- Fetch icon bodies from Iconify ----------------------------------------
const uniqueIds = [...new Set(entries.map((e) => e.id))]
console.log(`Fetching ${uniqueIds.length} Material Icons for ${entries.length} registry entries…`)

const bodies = new Map()
const CHUNK = 60
for (let i = 0; i < uniqueIds.length; i += CHUNK) {
  const chunk = uniqueIds.slice(i, i + CHUNK)
  // Query with the `baseline-` (filled) style prefix — the ic set exposes
  // every icon under style-prefixed names and does not resolve bare aliases.
  const url = `https://api.iconify.design/ic.json?icons=${chunk.map((id) => `baseline-${id}`).join(',')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${chunk[0]}…`)
  const json = await res.json()
  if (json.not_found?.length) throw new Error(`Unknown Material icons: ${json.not_found.join(', ')}`)
  for (const id of chunk) {
    const body = json.icons[`baseline-${id}`]?.body
    if (!body) throw new Error(`No body returned for icon: baseline-${id}`)
    bodies.set(id, body)
  }
}

// --- Parse bodies → primitives ---------------------------------------------
const PATH_RE = /<path[^>]*?\sd="([^"]+)"/g
const CIRCLE_RE = /<circle\s+cx="([\d.]+)"\s+cy="([\d.]+)"\s+r="([\d.]+)"[^>]*>/g

function parseBody(id, body) {
  if (/<(rect|line|polyline|polygon|ellipse)\b/.test(body)) {
    throw new Error(`${id}: unexpected non-path element in body`)
  }
  if (/transform=/.test(body)) throw new Error(`${id}: transform attribute not supported`)
  const paths = [...body.matchAll(PATH_RE)].map((m) => m[1])
  const circles = [...body.matchAll(CIRCLE_RE)].map((m) => ({
    cx: Number(m[1]),
    cy: Number(m[2]),
    r: Number(m[3]),
  }))
  // ensure every circle matched the strict attr order
  const circleCount = (body.match(/<circle\b/g) ?? []).length
  if (circles.length !== circleCount) throw new Error(`${id}: unparsed <circle> attrs`)
  if (!paths.length && !circles.length) throw new Error(`${id}: no <path>/<circle> found`)
  return { paths, circles }
}

const parsed = new Map()
for (const [id, body] of bodies) parsed.set(id, parseBody(id, body))

// --- Optical size normalization ----------------------------------------------
// Material icons are drawn on keylines: ink size varies deliberately per
// shape (chevrons 12px, clouds 24px). Inside a UI kit that variance reads as
// inconsistent sizing, so each icon gets a per-icon viewBox that scales its
// ink toward a common target size (clamped, so small marks don't blow up).

function pathBBox(d, points) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []
  let i = 0
  let cmd = null
  let x = 0, y = 0, sx = 0, sy = 0
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const pt = (px, py) => {
    if (px < minX) minX = px
    if (py < minY) minY = py
    if (px > maxX) maxX = px
    if (py > maxY) maxY = py
    if (points) points.push([px, py])
  }
  const num = () => Number(tokens[i++])
  const hasNum = () => i < tokens.length && !/[a-zA-Z]/.test(tokens[i])
  const cubic = (p0, p1, p2, p3) => {
    for (let k = 0; k <= 16; k++) {
      const t = k / 16, u = 1 - t
      pt(u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
         u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1])
    }
  }
  const quad = (p0, p1, p2) => {
    for (let k = 0; k <= 16; k++) {
      const t = k / 16, u = 1 - t
      pt(u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
         u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])
    }
  }
  const arc = (rx, ry, rot, large, sweep, x2, y2) => {
    if (rx === 0 || ry === 0) { pt(x2, y2); return }
    const phi = (rot * Math.PI) / 180
    const cosP = Math.cos(phi), sinP = Math.sin(phi)
    const dx = (x - x2) / 2, dy = (y - y2) / 2
    let x1p = cosP * dx + sinP * dy
    let y1p = -sinP * dx + cosP * dy
    rx = Math.abs(rx); ry = Math.abs(ry)
    const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
    if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam) }
    const num_ = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    let co = Math.sqrt(Math.max(0, num_ / den))
    if (large === sweep) co = -co
    const cxp = (co * rx * y1p) / ry
    const cyp = (-co * ry * x1p) / rx
    const cx = cosP * cxp - sinP * cyp + (x + x2) / 2
    const cy = sinP * cxp + cosP * cyp + (y + y2) / 2
    const ang = (ux, uy, vx, vy) => {
      const dot = ux * vx + uy * vy
      const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy))
      let a = Math.acos(Math.min(1, Math.max(-1, dot / len)))
      if (ux * vy - uy * vx < 0) a = -a
      return a
    }
    const th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if (!sweep && dth > 0) dth -= 2 * Math.PI
    if (sweep && dth < 0) dth += 2 * Math.PI
    const steps = Math.max(4, Math.ceil(Math.abs(dth) / (Math.PI / 12)))
    for (let k = 0; k <= steps; k++) {
      const th = th1 + (dth * k) / steps
      pt(cx + rx * Math.cos(th) * cosP - ry * Math.sin(th) * sinP,
         cy + rx * Math.cos(th) * sinP + ry * Math.sin(th) * cosP)
    }
  }

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++]
    const rel = cmd === cmd.toLowerCase()
    const c = cmd.toUpperCase()
    if (c === 'M') {
      const nx = num(), ny = num()
      x = rel ? x + nx : nx; y = rel ? y + ny : ny
      sx = x; sy = y; pt(x, y)
      cmd = rel ? 'l' : 'L'
    } else if (c === 'L') {
      const nx = num(), ny = num()
      x = rel ? x + nx : nx; y = rel ? y + ny : ny; pt(x, y)
    } else if (c === 'H') {
      const nx = num(); x = rel ? x + nx : nx; pt(x, y)
    } else if (c === 'V') {
      const ny = num(); y = rel ? y + ny : ny; pt(x, y)
    } else if (c === 'C') {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), xe = num(), ye = num()
      const p1 = rel ? [x + x1, y + y1] : [x1, y1]
      const p2 = rel ? [x + x2, y + y2] : [x2, y2]
      const pe = rel ? [x + xe, y + ye] : [xe, ye]
      cubic([x, y], p1, p2, pe); x = pe[0]; y = pe[1]
    } else if (c === 'S') {
      const x2 = num(), y2 = num(), xe = num(), ye = num()
      const p2 = rel ? [x + x2, y + y2] : [x2, y2]
      const pe = rel ? [x + xe, y + ye] : [xe, ye]
      cubic([x, y], [x, y], p2, pe); x = pe[0]; y = pe[1]
    } else if (c === 'Q') {
      const x1 = num(), y1 = num(), xe = num(), ye = num()
      const p1 = rel ? [x + x1, y + y1] : [x1, y1]
      const pe = rel ? [x + xe, y + ye] : [xe, ye]
      quad([x, y], p1, pe); x = pe[0]; y = pe[1]
    } else if (c === 'T') {
      const xe = num(), ye = num()
      const pe = rel ? [x + xe, y + ye] : [xe, ye]
      quad([x, y], [x, y], pe); x = pe[0]; y = pe[1]
    } else if (c === 'A') {
      const rx = num(), ry = num(), rot = num(), large = num(), sweep = num(), xe = num(), ye = num()
      const pe = rel ? [x + xe, y + ye] : [xe, ye]
      arc(rx, ry, rot, large, sweep, pe[0], pe[1]); x = pe[0]; y = pe[1]
    } else if (c === 'Z') {
      x = sx; y = sy
    }
    if (!hasNum() && i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) i++
  }
  return { minX, minY, maxX, maxY }
}

function inkBBox({ paths, circles }) {
  const points = []
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const d of paths) {
    const b = pathBBox(d, points)
    minX = Math.min(minX, b.minX); minY = Math.min(minY, b.minY)
    maxX = Math.max(maxX, b.maxX); maxY = Math.max(maxY, b.maxY)
  }
  for (const c of circles) {
    minX = Math.min(minX, c.cx - c.r); minY = Math.min(minY, c.cy - c.r)
    maxX = Math.max(maxX, c.cx + c.r); maxY = Math.max(maxY, c.cy + c.r)
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 2 * Math.PI
      points.push([c.cx + c.r * Math.cos(a), c.cy + c.r * Math.sin(a)])
    }
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY, points }
}

// Two optical tiers, mirroring how mature stroke sets (Lucide/Tabler) draw
// simple marks smaller than full icons but equal to EACH OTHER:
//   full icons (ink ≥ 15)  → ink longest side renders 20 of 24 units
//   compact marks (< 15)   → ink longest side renders 18 of 24 units
//     (close/plus/minus 14, chevrons 12, play/pause 14, bold/italic 14…)
// Zoom is clamped to [0.75, 1.5] so tiny carets (triangles, sort arrows)
// don't blow up and full-bleed icons don't shrink to nothing.
const FULL_TARGET = 20
const MARK_TARGET = 18
const MARK_INK = 15
const MIN_ZOOM = 0.75
const MAX_ZOOM = 1.5

// Corner compensation. Equal bounding boxes are NOT equal optical sizes:
// a glyph whose ink reaches the corners of its box (×, diagonal arrows,
// solid squares) has a visual diameter of bbox×√2 and reads larger than a
// same-box glyph that leaves corners empty (+, ○, chevron). Icon systems
// solve this with keyline shapes (Material: square 18 vs circle 20; Lucide
// draws × at 12 but + at 14). Material itself draws × and + at the SAME
// 14px — reproducing that is what made close look oversized.
//
// Measure corner occupancy: r = (max ink projection over 8 angles) /
// (bbox diagonal). r ≈ 0.707 for an inscribed circle (no compensation),
// r → 1 when ink fills the corners. Applied only to near-square boxes —
// wide/tall glyphs (rectangles, chevrons) don't exhibit the effect.
const CORNER_R_BASE = 0.72 // ≤ this → factor 1 (circle-like)
const CORNER_FACTOR = 0.87 // r = 1 → target × 0.87 (≈ Lucide ×/+ ratio 12/14)

function cornerCompensation(b) {
  const w = b.w, h = b.h
  if (Math.min(w, h) <= 0) return 1
  const aspect = Math.max(w, h) / Math.min(w, h)
  if (aspect > 1.25) return 1
  const diag = Math.hypot(w, h)
  if (diag <= 0) return 1
  let maxExtent = 0
  for (let a = 0; a < 180; a += 22.5) {
    const rad = (a * Math.PI) / 180
    const ux = Math.cos(rad), uy = Math.sin(rad)
    let lo = Infinity, hi = -Infinity
    for (const [px, py] of b.points) {
      const p = px * ux + py * uy
      if (p < lo) lo = p
      if (p > hi) hi = p
    }
    if (hi - lo > maxExtent) maxExtent = hi - lo
  }
  const r = maxExtent / diag
  const t = Math.min(1, Math.max(0, (r - CORNER_R_BASE) / (1 - CORNER_R_BASE)))
  return 1 - t * (1 - CORNER_FACTOR)
}

function normalizedViewBox(icon) {
  const b = inkBBox(icon)
  const inkMax = Math.max(b.w, b.h)
  if (inkMax <= 0) return '0 0 24 24'
  const target = (inkMax < MARK_INK ? MARK_TARGET : FULL_TARGET) * cornerCompensation(b)
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, target / inkMax))
  const side = 24 / zoom
  const cx = (b.minX + b.maxX) / 2
  const cy = (b.minY + b.maxY) / 2
  const x0 = cx - side / 2
  const y0 = cy - side / 2
  const r = (v) => Math.round(v * 100) / 100
  if (Math.abs(x0) < 0.01 && Math.abs(y0) < 0.01 && Math.abs(side - 24) < 0.01) return '0 0 24 24'
  return `${r(x0)} ${r(y0)} ${r(side)} ${r(side)}`
}

const viewBoxes = new Map()
for (const [id, icon] of parsed) viewBoxes.set(id, normalizedViewBox(icon))

// --- Emit icons.ts -----------------------------------------------------------
function escapePath(d) {
  return d.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function keyOf(name) {
  return /^[$_a-z]\w*$/i.test(name) ? name : `'${name}'`
}

function formatEntry(entry) {
  const { paths, circles } = parsed.get(entry.id)
  const helper = entry.spin ? 'spinIcon' : 'f'
  const parts = [
    `'${viewBoxes.get(entry.id)}'`,
    ...paths.map((d) => `'${escapePath(d)}'`),
    ...circles.map((c) => `{ cx: ${c.cx}, cy: ${c.cy}, r: ${c.r} }`),
  ]
  if (parts.length === 2) return `  ${keyOf(entry.name)}: ${helper}(${parts[0]}, ${parts[1]}),`
  const body = parts.map((p) => `    ${p},`).join('\n')
  return `  ${keyOf(entry.name)}: ${helper}(\n${body}\n  ),`
}

const header = `/**
 * Built-in system icons — filled (Google Material Icons baseline).
 * GENERATED by scripts/generate-system-icons.mjs — do not edit by hand.
 * Filled shapes stay crisp at small sizes (14–16px), unlike stroke icons.
 * Each icon's viewBox is normalized for consistent optical size (full icons
 * 20/24, compact marks 18/24, corner-filling glyphs reduced ~13%) —
 * Material keyline variance is replaced by keyline-aware sizing.
 * App-specific icons → default slot (Lucide etc.), see docs.
 */
import type { IconDefinition, IconPrimitive } from './icons-types'

export type { IconDefinition, IconPrimitive } from './icons-types'

type IconPart = string | { cx: number, cy: number, r: number }

function toPrimitive(part: IconPart): IconPrimitive {
  if (typeof part === 'string') return { tag: 'path', d: part, fill: 'currentColor', stroke: 'none' }
  return { tag: 'circle', cx: part.cx, cy: part.cy, r: part.r, fill: 'currentColor' }
}

/** Filled icon (fill currentColor, no stroke, per-icon normalized viewBox). */
function f(viewBox: string, ...parts: IconPart[]): IconDefinition {
  return {
    viewBox,
    primitives: parts.map(toPrimitive),
  }
}

/** Spinning filled icon (loader). */
function spinIcon(viewBox: string, ...parts: IconPart[]): IconDefinition {
  return { ...f(viewBox, ...parts), spin: true }
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
