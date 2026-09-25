import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface GoldenPageRecord {
  id: string
  file: string
  title: string
  titleEn: string
  patternId: string
  /** Visual style preset this sample demonstrates (structure may be shared). */
  style?: string
  /** Canonical structure id when this is a craft variant. */
  variantOf?: string
}

export const goldenPageCatalog: GoldenPageRecord[] = [
  {
    id: 'list-page',
    file: 'list-page.vue',
    title: '列表页黄金样例（soft）',
    titleEn: 'List page golden sample (soft)',
    patternId: 'admin-list',
    style: 'soft',
  },
  {
    id: 'list-page-dense',
    file: 'list-page-dense.vue',
    title: '列表页黄金样例（dense）',
    titleEn: 'List page golden sample (dense)',
    patternId: 'admin-list',
    style: 'dense',
    variantOf: 'list-page',
  },
  {
    id: 'list-page-rail',
    file: 'list-page-rail.vue',
    title: '列表页黄金样例（rail）',
    titleEn: 'List page golden sample (rail)',
    patternId: 'admin-list',
    style: 'rail',
    variantOf: 'list-page',
  },
  {
    id: 'form-page',
    file: 'form-page.vue',
    title: '表单页黄金样例',
    titleEn: 'Form page golden sample',
    patternId: 'form-page',
  },
  {
    id: 'dashboard-page',
    file: 'dashboard-page.vue',
    title: '仪表盘黄金样例',
    titleEn: 'Dashboard golden sample',
    patternId: 'dashboard',
  },
  {
    id: 'login-page',
    file: 'login-page.vue',
    title: '登录页黄金样例',
    titleEn: 'Login page golden sample',
    patternId: 'auth-page',
  },
  {
    id: 'landing-page',
    file: 'landing-page.vue',
    title: '营销落地页黄金样例',
    titleEn: 'Marketing landing golden sample',
    patternId: 'marketing-landing',
  },
  {
    id: 'empty-state',
    file: 'empty-state.vue',
    title: '空状态黄金样例',
    titleEn: 'Empty state golden sample',
    patternId: 'empty-state',
  },
  {
    id: 'detail-page',
    file: 'detail-page.vue',
    title: '详情页黄金样例',
    titleEn: 'Detail page golden sample',
    patternId: 'detail-page',
  },
  {
    id: 'form-in-dialog',
    file: 'form-in-dialog.vue',
    title: '列表内弹窗表单黄金样例',
    titleEn: 'List create/edit dialog golden sample',
    patternId: 'form-in-dialog',
  },
  {
    id: 'result-page',
    file: 'result-page.vue',
    title: '结果 / 阻断页黄金样例',
    titleEn: 'Result / terminal page golden sample',
    patternId: 'result-page',
  },
  {
    id: 'settings-page',
    file: 'settings-page.vue',
    title: '设置页黄金样例',
    titleEn: 'Settings page golden sample',
    patternId: 'settings-page',
  },
  {
    id: 'wizard-form',
    file: 'wizard-form.vue',
    title: '分步向导黄金样例',
    titleEn: 'Wizard form golden sample',
    patternId: 'wizard-form',
  },
]

/** Map style preset → list golden craft variant (same structure). */
const listStyleGolden: Record<string, string> = {
  soft: 'list-page',
  quiet: 'list-page',
  studio: 'list-page',
  ink: 'list-page',
  dense: 'list-page-dense',
  rail: 'list-page-rail',
}

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundledDir = join(pkgRoot, 'data/golden-pages')
const repoDir = join(pkgRoot, '../../design-kit/docs/golden-pages')

function resolveGoldenPagesDir(): string | null {
  if (existsSync(bundledDir)) return bundledDir
  if (existsSync(repoDir)) return repoDir
  return null
}

export function listGoldenPages() {
  return goldenPageCatalog
}

export function findGoldenPage(id: string): GoldenPageRecord | undefined {
  const key = id.trim().toLowerCase().replace(/\.vue$/i, '').replace(/[-_\s]/g, '')
  return goldenPageCatalog.find((item) => item.id.replace(/[-_\s]/g, '') === key)
}

/**
 * Pick the best golden for a pattern + optional style preset.
 * Falls back to the pattern's canonical sample when no style variant exists.
 */
export function resolveGoldenPageId(args: {
  patternId?: string | null
  canonicalGoldenId?: string | null
  styleId?: string | null
}): string | null {
  const style = args.styleId?.trim().toLowerCase() || ''
  const canonical =
    args.canonicalGoldenId?.split('/').pop()?.replace(/\.vue$/i, '') ||
    (args.patternId
      ? goldenPageCatalog.find((item) => item.patternId === args.patternId && !item.variantOf)?.id
      : null) ||
    null

  if (args.patternId === 'admin-list' || canonical === 'list-page' || canonical?.startsWith('list-page')) {
    const styled = style ? listStyleGolden[style] : null
    if (styled && findGoldenPage(styled)) return styled
    return 'list-page'
  }

  if (canonical && findGoldenPage(canonical)) return canonical
  if (args.patternId) {
    const match = goldenPageCatalog.find((item) => item.patternId === args.patternId && !item.variantOf)
    return match?.id ?? null
  }
  return null
}

export function readGoldenPageSource(id: string): { record: GoldenPageRecord; source: string } | null {
  const record = findGoldenPage(id)
  if (!record) return null
  const dir = resolveGoldenPagesDir()
  if (!dir) return null
  const path = join(dir, record.file)
  if (!existsSync(path)) return null
  return { record, source: readFileSync(path, 'utf8').replace(/^\uFEFF/, '') }
}

export function goldenPagesAvailable(): boolean {
  const dir = resolveGoldenPagesDir()
  if (!dir) return false
  return goldenPageCatalog.every((item) => existsSync(join(dir, item.file)))
}

export function listGoldenPageFilesOnDisk(): string[] {
  const dir = resolveGoldenPagesDir()
  if (!dir) return []
  return readdirSync(dir).filter((name) => name.endsWith('.vue'))
}
