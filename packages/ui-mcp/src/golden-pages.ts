import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface GoldenPageRecord {
  id: string
  file: string
  title: string
  titleEn: string
  patternId: string
}

export const goldenPageCatalog: GoldenPageRecord[] = [
  {
    id: 'list-page',
    file: 'list-page.vue',
    title: '列表页黄金样例',
    titleEn: 'List page golden sample',
    patternId: 'admin-list',
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
