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
]

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundledDir = join(pkgRoot, 'data/golden-pages')
const repoDir = join(pkgRoot, '../../ai-design-config/docs/golden-pages')

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
