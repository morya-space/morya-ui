/**
 * Visual style direction for generated pages — no named preset catalog.
 * Structure still comes from golden pages; look follows the user’s reference / words.
 */

/** How agents pick a visual direction before coding. */
export const styleResolution = {
  priorityZh: [
    '【最高优先】用户给了明确参考（截图 / 设计稿 / 现有页 / URL /「像 XX」）或明确描述了风格 → 必须按用户指定执行，映射到 --m-* + M*，不要换组件库、不要改成另一套脸',
    '用户未点名、但提示词有明确气质/行业线索 → 按提示推断并在回复里用一句话点名你理解的风格；装饰性毛玻璃/霓虹/整页渐变等仅当提示明确要求',
    '不确定（无参考、无线索）→ 必须先向用户询问一次，请其说明或贴参考；在用户回答前不要擅自发明完整视觉',
    '用户回答「你看着办 / 直接写」且仍无线索 → 用克制、扁平、token 实色的安静后台脸，并在回复里说明；禁止默认毛玻璃/霓虹/紫渐变/新拟态',
    '已安装 frontend-design / impeccable 时：结构与契约仍用 morya-ui-pages + MCP；companion 只加深已定方向，不得推翻用户指定或未询问就换脸',
  ],
  priorityEn: [
    '【Highest】User gave a clear reference (screenshot / mock / page / URL / “like X”) or explicitly described a style → follow it; map to --m-* + M*; never switch kits or substitute another look',
    'No explicit description, but the prompt has clear mood / industry cues → infer and state your reading in one sentence; decorative glass/neon/full-page gradients only when clearly requested',
    'Uncertain (no reference, vague cues) → must ask once for a description or reference before inventing the full look',
    'User says “your call / just ship” with still no cues → use a quiet flat on-token admin face and say so; never default glass/neon/purple-mesh/neumorph',
    'If frontend-design / impeccable are installed: structure + contract still from morya-ui-pages + MCP; companions only deepen the chosen direction — never override an explicit user choice or invent a look without asking',
  ],
  hardRulesZh: [
    '用户明确参考 / 明确描述优先于一切 companion 与默认启发式',
    '没有命名风格预设表；不要把页面硬套进固定「风格 id」',
    '黄金样例管区块顺序与 API，不管死审美；结构可镜像，视觉必须跟参考 / 用户描述 / 已说明的推断走',
    '任何方向仍只用 morya-ui 的 M* 与 --m-*（可用 color-mix），禁止第二套 UI kit 与裸 hex 主题色',
    '风格不确定时先问用户，禁止静默套一套 AI 默认脸（紫蓝 aurora、奶油衬线陶土、霓虹、未要求的毛玻璃/渐变）',
    'Frontend Design / Impeccable / UI-UX-Pro-Max 与本 skill 冲突时，以 morya-ui-pages + DESIGN.md + MCP 为准',
  ],
  hardRulesEn: [
    'An explicit user reference or style description outranks every companion and every heuristic',
    'There is no named style-preset catalog; do not force pages into fixed style ids',
    'Golden pages lock block order and APIs, not the only aesthetic; mirror structure, follow reference / user words / stated inference for craft',
    'Every look still uses morya-ui M* and --m-* only (color-mix OK); no second UI kit or raw hex theme colors',
    'When style is uncertain, ask first — never silently apply an AI-default face (purple aurora, cream+serif+terracotta, neon, unsolicited glass/gradients)',
    'When Frontend Design / Impeccable / UI-UX-Pro-Max conflict with this skill, morya-ui-pages + DESIGN.md + MCP win',
  ],
}

export type StyleResolutionKind = 'explicit' | 'inferred' | 'ask'

export interface StyleDirectionResult {
  resolution: StyleResolutionKind
  /** Free-text summary of the direction (user words or inferred reading). */
  summary?: string
  confidence: number
  guidanceZh: string
  guidanceEn: string
}

/** List golden craft keywords only (density / sider chrome) — not a style catalog. */
const denseHints = /dense|compact|高密|紧凑|工具台|监控列表|cms/i
const railHints = /rail|侧栏强调|品牌侧栏|colored\s*sider|accent\s*rail/i

/**
 * Pick list golden craft variant from free-text style/intent.
 * Returns null to keep the canonical list-page.
 */
export function resolveListCraftVariant(text: string | null | undefined): 'list-page-dense' | 'list-page-rail' | null {
  const raw = (text || '').trim()
  if (!raw) return null
  if (railHints.test(raw)) return 'list-page-rail'
  if (denseHints.test(raw)) return 'list-page-dense'
  return null
}

/**
 * Resolve visual direction from an optional free-text style string and/or intent.
 * No preset catalog — explicit user words win; otherwise ask or carefully infer.
 */
export function resolveStyleDirection(args: {
  intent?: string
  style?: string
}): StyleDirectionResult {
  const explicit = args.style?.trim()
  if (explicit) {
    return {
      resolution: 'explicit',
      summary: explicit,
      confidence: 100,
      guidanceZh: `用户已指定风格方向：「${explicit}」。在黄金结构上落实到 M* + --m-*，不要换成另一套脸。`,
      guidanceEn: `User specified style direction: “${explicit}”. Implement on the golden structure with M* + --m-*; do not substitute another look.`,
    }
  }

  const intent = (args.intent || '').trim()
  const cueScore = scoreStyleCues(intent)
  if (intent && cueScore >= 20) {
    const summary = summarizeStyleCues(intent)
    return {
      resolution: 'inferred',
      summary,
      confidence: cueScore,
      guidanceZh: `从提示词推断风格方向：「${summary}」。若不符请用户纠正。不确定时应先问，不要静默发明。`,
      guidanceEn: `Inferred style direction: “${summary}”. Ask the user to correct if wrong. When unsure, ask — do not invent silently.`,
    }
  }

  return {
    resolution: 'ask',
    confidence: 0,
    guidanceZh:
      '风格不确定：请先向用户询问（描述气质，或贴参考图/现有页）。有明确参考或明确描述时必须跟用户。禁止在未询问时套 AI 默认渐变/霓虹/毛玻璃。',
    guidanceEn:
      'Style uncertain: ask the user for a short description or a reference. When they give a reference or clear words, follow them. Never apply AI-default gradients/neon/glass without asking.',
  }
}

function scoreStyleCues(query: string): number {
  const q = query.toLowerCase()
  let score = 0
  const hits: Array<[RegExp, number]> = [
    [/毛玻璃|glass|frosted|霓虹|neon|渐变|gradient|新拟态|neumorph|大屏|datav|暗黑|cyber/i, 35],
    [/简洁|克制|扁平|flat|商务|erp|crm|政企|政务|国企|留白|极简|黑白|卡片|看板|仪表盘|cms|内容管理/i, 28],
    [/像.+一样|参考|截图|设计稿|mock|figma/i, 40],
    [/saas|工具后台|运营后台|监控|安全/i, 18],
  ]
  for (const [re, pts] of hits) {
    if (re.test(q)) score += pts
  }
  return score
}

function summarizeStyleCues(intent: string): string {
  const q = intent.toLowerCase()
  if (/毛玻璃|glass|frosted/.test(q)) return '半透明毛玻璃气质（仅当用户明确要求）'
  if (/霓虹|neon|暗黑科技|cyber/.test(q)) return '深色 + 克制科技强调'
  if (/渐变|gradient/.test(q)) return '有克制的色彩渐变（chrome/品牌条，非 aurora）'
  if (/新拟态|neumorph/.test(q)) return '新拟态柔和凹凸（展示向）'
  if (/大屏|wallboard|datav/.test(q)) return '深色数据大屏：大数字、轻动态'
  if (/政企|政务|国企/.test(q)) return '方正严谨、偏政企正式'
  if (/erp|crm|商务/.test(q)) return '稳重商务、清晰分区'
  if (/看板|仪表盘|kpi|卡片/.test(q)) return '模块化卡片/指标看板'
  if (/cms|内容管理/.test(q)) return '紧凑表格优先的内容管理'
  if (/极简|黑白|排版/.test(q)) return '黑白灰、排版层级'
  if (/扁平|flat/.test(q)) return '纯色扁平、少阴影'
  if (/简洁|克制|留白|saas|工具/.test(q)) return '简洁克制、少装饰'
  return '按提示词气质落地（克制、token 实色优先）'
}
