/**
 * Named visual directions for generated pages.
 * Structure still comes from golden pages; presets only change craft (density, chrome, atmosphere).
 */

export interface StylePreset {
  id: string
  title: string
  titleEn: string
  summary: string
  summaryEn: string
  lanes: Array<'ops' | 'account' | 'flow' | 'express' | 'system'>
  keywords: string[]
  cues: string[]
  cuesEn: string[]
  apply: string[]
  applyEn: string[]
  avoid: string[]
  avoidEn: string[]
  /** Preferred list golden craft variant when pattern is admin-list. */
  listGoldenPage?: string
}

/** How agents pick a visual direction before coding. */
export const styleResolution = {
  priorityZh: [
    '用户给了参考样式（截图 / 设计稿 / 现有页 / URL /「像 XX」）→ 提取层级、密度、表面、强调色，映射到 --m-* + M*，不要换组件库',
    '用户点名了风格 id / 中文名（如 soft、柔和留白）→ 套用该预设',
    '提示词里有气质/行业线索（严谨、活泼、医疗、金融…）→ 推断最接近的预设，并在回复里点名；可选 ui-ux-pro-max 只搜关键词',
    '以上都没有 → 用一句话列出 3～4 个可选风格请用户选；若用户明确说「直接写」→ 按域启发式选一个，不要永远 quiet',
    '已安装 frontend-design / impeccable 时：结构与契约仍用 morya-ui-pages + MCP；companion 只加深审美/抛光（见 skill optional-companions）',
  ],
  priorityEn: [
    'User supplied a reference (screenshot / mock / existing page / URL / “like X”) → extract hierarchy, density, surfaces, accent; map to --m-* + M*; never switch UI kits',
    'User named a style id / label (e.g. soft) → apply that preset',
    'Prompt has mood / industry cues → infer the closest preset and name it; optional ui-ux-pro-max for keywords only',
    'None of the above → ask once with 3–4 style options; if user says “just ship it” → pick by domain heuristic, do not always use quiet',
    'If frontend-design / impeccable are installed: structure + contract still from morya-ui-pages + MCP; companions only deepen taste/polish (see skill optional-companions)',
  ],
  hardRulesZh: [
    '黄金样例管区块顺序与 API，不管死审美；结构可镜像，视觉必须跟参考 / 风格 / 提示词走',
    '任何风格仍只用 morya-ui 的 M* 与 --m-*（可用 color-mix），禁止第二套 UI kit 与裸 hex 主题色',
    'Ops 页不要做成营销落地页；Express 不要假装后台 CRUD',
    'Frontend Design / Impeccable / UI-UX-Pro-Max 与本 skill 冲突时，以 morya-ui-pages + DESIGN.md + MCP 为准',
  ],
  hardRulesEn: [
    'Golden pages lock block order and APIs, not the only aesthetic; mirror structure, follow reference / style / prompt for craft',
    'Every style still uses morya-ui M* and --m-* only (color-mix OK); no second UI kit or raw hex theme colors',
    'Ops pages must not become marketing landings; Express must not pretend to be admin CRUD',
    'When Frontend Design / Impeccable / UI-UX-Pro-Max conflict with this skill, morya-ui-pages + DESIGN.md + MCP win',
  ],
}

export const stylePresets: StylePreset[] = [
  {
    id: 'quiet',
    title: '克制经典',
    titleEn: 'Quiet classic',
    summary: '接近黄金样例：扁平 chrome、单主按钮、少装饰，适合严肃后台。',
    summaryEn: 'Closest to golden pages: flat chrome, one primary, little decoration — serious admin.',
    lanes: ['ops', 'system'],
    keywords: ['quiet', 'classic', '克制', '经典', '默认', '朴素', '严肃', 'enterprise', 'plain'],
    cues: ['扁平表面', 'MPageFilters plain 或轻 filled', '默认 density', '无侧栏氛围色'],
    cuesEn: ['Flat surfaces', 'Plain or light filled filters', 'Default density', 'No sider wash'],
    apply: [
      '镜像 list/form 黄金结构与 Ops polish',
      'MPageContent 默认 density；筛选可 plain',
      '不要额外氛围渐变或大段说明',
    ],
    applyEn: [
      'Mirror list/form golden structure + Ops polish',
      'Default MPageContent density; filters may stay plain',
      'No atmosphere gradients or long marketing copy',
    ],
    avoid: ['营销 hero', '多主色块抢焦点'],
    avoidEn: ['Marketing hero', 'Competing accent blocks'],
    listGoldenPage: 'list-page',
  },
  {
    id: 'soft',
    title: '柔和留白',
    titleEn: 'Soft spacious',
    summary: '更松的间距与说明文案，筛选带浅底，表格仍干净，适合运营/内容后台。',
    summaryEn: 'Roomier spacing and descriptions, soft filter band, clean table — ops/content admin.',
    lanes: ['ops', 'account', 'flow'],
    keywords: ['soft', 'spacious', '柔和', '留白', '轻松', '友好', '运营', '内容', 'breathing'],
    cues: ['MPageContent density="spacious"', 'MPageFilters variant="filled"', 'MPageHeader 带短 description', '状态用 MStatus'],
    cuesEn: ['MPageContent density="spacious"', 'Filled filters', 'Short header description', 'MStatus for row state'],
    apply: [
      '标题下保留一句域说明',
      '筛选用 filled；高级项 collapsible',
      '行操作 text/small；空态 MEmpty 带下一步',
    ],
    applyEn: [
      'Keep one domain sentence under the title',
      'Filled filters; collapsible advanced fields',
      'Text/small row actions; MEmpty with a next step',
    ],
    avoid: ['compact 挤成工具台', '装饰 Card 包表格'],
    avoidEn: ['Forced compact toolkit feel', 'Decorative Card around the table'],
    listGoldenPage: 'list-page',
  },
  {
    id: 'dense',
    title: '高密度工具台',
    titleEn: 'Dense toolkit',
    summary: '紧凑控件与表格，信息优先，适合监控、运维、交易员类界面。',
    summaryEn: 'Tight controls and tables, information-first — monitoring, ops, trader-like UIs.',
    lanes: ['ops'],
    keywords: ['dense', 'compact', '高密', '紧凑', '工具台', '运维', '监控', 'power user', 'trading'],
    cues: ['MPageContent density="compact"', '表格 size="small"', '筛选控件更窄', '少 description'],
    cuesEn: ['Compact page density', 'size="small" table', 'Narrower filters', 'Minimal descriptions'],
    apply: [
      'compact + 小尺寸表格/按钮',
      '筛选一行尽量排完；高级项折叠',
      '全视口主列表可考虑 fill',
    ],
    applyEn: [
      'Compact density + small table/buttons',
      'Fit filters on one row; collapse advanced',
      'Full-viewport main lists may use fill',
    ],
    avoid: ['大留白 KPI 条', '营销文案腔'],
    avoidEn: ['Large airy KPI strips', 'Marketing voice'],
    listGoldenPage: 'list-page-dense',
  },
  {
    id: 'rail',
    title: '侧栏强调',
    titleEn: 'Accent rail',
    summary: '侧栏/顶栏用 primary 的 token 氛围，主内容仍克制，适合有品牌色的 B 端。',
    summaryEn: 'Token wash on sider/header, calm content — branded B2B shells.',
    lanes: ['ops', 'account'],
    keywords: ['rail', 'accent', '侧栏', '强调', '品牌', 'brand', 'colored sider', '主色'],
    cues: [
      '侧栏或顶栏 scoped 背景用 color-mix(primary)',
      '菜单项全带 icon',
      '内容区保持安静',
    ],
    cuesEn: [
      'Sider/header scoped bg via color-mix(primary)',
      'Menu icons on every item',
      'Content area stays calm',
    ],
    apply: [
      '仅 chrome 做氛围，不把表格做成营销块',
      '主按钮仍唯一 primary',
      '颜色只用 --m-* / color-mix',
    ],
    applyEn: [
      'Atmosphere on chrome only — not on the data table',
      'Still one filled primary',
      'Colors only via --m-* / color-mix',
    ],
    avoid: ['整页渐变背景', '紫蓝 AI 默认渐变'],
    avoidEn: ['Full-page gradient backgrounds', 'Purple-indigo AI default gradients'],
    listGoldenPage: 'list-page-rail',
  },
  {
    id: 'studio',
    title: '工作室呼吸感',
    titleEn: 'Studio breath',
    summary: '更强的标题层级与章节感，适合设计/协作/知识类产品后台。',
    summaryEn: 'Stronger title hierarchy and sectioning — design, collab, knowledge products.',
    lanes: ['ops', 'flow', 'express'],
    keywords: ['studio', 'editorial', '工作室', '呼吸', '设计', '协作', '知识', 'creative', 'craft'],
    cues: [
      'MPageHeader 标题更醒目 + description',
      '可用 MPageSection 分组次要块',
      '空态/引导更精致（仍 MEmpty）',
    ],
    cuesEn: [
      'Stronger MPageHeader + description',
      'MPageSection for secondary groups',
      'Richer empty/guidance still via MEmpty',
    ],
    apply: [
      '层级靠字号与间距，不靠花哨阴影',
      '可加 1 个 token 氛围（径向淡彩）',
      '表格保持直接放 PageContent',
    ],
    applyEn: [
      'Hierarchy via type and space, not heavy shadows',
      'Optional one token wash (radial tint)',
      'Keep the table directly in PageContent',
    ],
    avoid: ['报纸多栏排版', '一排实心按钮'],
    avoidEn: ['Broadsheet multi-column look', 'Wall of filled buttons'],
    listGoldenPage: 'list-page',
  },
  {
    id: 'ink',
    title: '线框极简',
    titleEn: 'Ink minimal',
    summary: '强调边框与结构线，少填充，适合偏工具/文档气质的界面。',
    summaryEn: 'Border-forward, little fill — tool/docs-like calm.',
    lanes: ['ops', 'system', 'flow'],
    keywords: ['ink', 'minimal', '线框', '极简', 'border', 'outline', '文档', 'docs', 'hairline'],
    cues: [
      'MPageFilters variant="plain"',
      'MTable bordered',
      '少用 filled 表面与 muted section',
    ],
    cuesEn: [
      'Plain filters',
      'Bordered table',
      'Few filled/muted surfaces',
    ],
    apply: [
      '用边框分区，不用大底色块',
      '字重克制；主按钮仍唯一',
      '避免零圆角报纸风（反 AI 默认）',
    ],
    applyEn: [
      'Partition with borders, not large fills',
      'Restrained weight; one primary button',
      'Avoid zero-radius broadsheet (anti AI-default)',
    ],
    avoid: ['暖奶油衬线套装', '多层阴影当个性'],
    avoidEn: ['Warm cream + serif kit', 'Multi-layer shadows as personality'],
    listGoldenPage: 'list-page',
  },
]

const aliasToId: Record<string, string> = {
  quiet: 'quiet',
  classic: 'quiet',
  克制: 'quiet',
  经典: 'quiet',
  默认: 'quiet',
  soft: 'soft',
  spacious: 'soft',
  柔和: 'soft',
  留白: 'soft',
  柔和留白: 'soft',
  dense: 'dense',
  compact: 'dense',
  高密: 'dense',
  紧凑: 'dense',
  工具台: 'dense',
  rail: 'rail',
  accent: 'rail',
  侧栏: 'rail',
  强调: 'rail',
  品牌: 'rail',
  studio: 'studio',
  editorial: 'studio',
  工作室: 'studio',
  呼吸: 'studio',
  ink: 'ink',
  minimal: 'ink',
  线框: 'ink',
  极简: 'ink',
}

export function findStylePreset(idOrAlias: string): StylePreset | undefined {
  const raw = idOrAlias.trim()
  if (!raw) return undefined
  const key = raw.toLowerCase().replace(/[-_\s]/g, '')
  const aliased = aliasToId[key]
  if (aliased) return stylePresets.find((p) => p.id === aliased)

  const byId = stylePresets.find((p) => p.id.replace(/[-_\s]/g, '') === key)
  if (byId) return byId

  const ranked = stylePresets
    .map((preset) => ({ preset, score: scoreStylePreset(preset, raw) }))
    .sort((a, b) => b.score - a.score)
  return ranked[0] && ranked[0].score >= 25 ? ranked[0].preset : undefined
}

export function scoreStylePreset(preset: StylePreset, query: string): number {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return 0
  let score = 0
  if (normalized === preset.id || normalized.includes(preset.id)) score += 50
  for (const keyword of preset.keywords) {
    const key = keyword.toLowerCase()
    if (normalized === key) score += 40
    else if (normalized.includes(key)) score += 12
  }
  if (normalized.includes(preset.title.toLowerCase())) score += 25
  if (normalized.includes(preset.titleEn.toLowerCase())) score += 25
  return score
}

export interface StyleDirectionResult {
  resolution: 'preset' | 'inferred' | 'offer'
  preset?: StylePreset
  confidence: number
  candidates: Array<{ id: string; title: string; titleEn: string; score: number }>
  guidanceZh: string
  guidanceEn: string
}

/**
 * Resolve a named style from an explicit id or free-text intent.
 * Reference styles are handled by the agent (cannot be detected from text alone).
 */
export function resolveStyleDirection(args: {
  intent?: string
  style?: string
}): StyleDirectionResult {
  const explicit = args.style?.trim()
  if (explicit) {
    const preset = findStylePreset(explicit)
    if (preset) {
      return {
        resolution: 'preset',
        preset,
        confidence: 100,
        candidates: [{ id: preset.id, title: preset.title, titleEn: preset.titleEn, score: 100 }],
        guidanceZh: `已选风格「${preset.title}」(${preset.id})。在黄金结构上套用该预设的 apply，并遵守 avoid。`,
        guidanceEn: `Style “${preset.titleEn}” (${preset.id}) selected. Apply its cues on the golden structure; honor avoid.`,
      }
    }
  }

  const query = [args.style || '', args.intent || ''].join(' ').trim()
  const ranked = stylePresets
    .map((preset) => ({ preset, score: scoreStylePreset(preset, query) }))
    .sort((a, b) => b.score - a.score || a.preset.id.localeCompare(b.preset.id))

  const best = ranked[0]
  const candidates = ranked.slice(0, 4).map((item) => ({
    id: item.preset.id,
    title: item.preset.title,
    titleEn: item.preset.titleEn,
    score: item.score,
  }))

  if (best && best.score >= 20) {
    return {
      resolution: 'inferred',
      preset: best.preset,
      confidence: best.score,
      candidates,
      guidanceZh: `从提示词推断风格「${best.preset.title}」(${best.preset.id})。若不符，用户可改选：${candidates.map((c) => `${c.id}/${c.title}`).join('、')}。`,
      guidanceEn: `Inferred style “${best.preset.titleEn}” (${best.preset.id}). User may switch: ${candidates.map((c) => `${c.id}/${c.titleEn}`).join(', ')}.`,
    }
  }

  return {
    resolution: 'offer',
    confidence: 0,
    candidates: stylePresets.slice(0, 4).map((preset) => ({
      id: preset.id,
      title: preset.title,
      titleEn: preset.titleEn,
      score: 0,
    })),
    guidanceZh:
      '未检测到明确风格。若用户已给参考样式，按参考提取并映射到 --m-*；否则用一句话请用户从 quiet/soft/dense/rail/studio/ink 中选，或按提示词域启发式选择（不要永远 quiet）。',
    guidanceEn:
      'No clear style. If the user gave a reference, extract cues onto --m-*; otherwise ask once among quiet/soft/dense/rail/studio/ink, or pick by domain heuristic (do not always use quiet).',
  }
}
