import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { parseYamlFrontmatter } from './parseFrontmatter.ts'

export const COMPONENT_DOCS_MANIFEST_ID = 'virtual:component-docs-manifest'
export const GUIDE_DOCS_MANIFEST_ID = 'virtual:guide-docs-manifest'

const resolvedComponentManifestId = `\0${COMPONENT_DOCS_MANIFEST_ID}`
const resolvedGuideManifestId = `\0${GUIDE_DOCS_MANIFEST_ID}`

function componentNameFromPath(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/')
  const match = normalized.match(/components\/([^/]+)\/docs\/index(?:\.en)?\.md$/)
  return match?.[1] ?? null
}

function guideSlugFromPath(filePath: string): { slug: string; lang: 'zh-CN' | 'en-US' } | null {
  const normalized = filePath.replace(/\\/g, '/')
  const match = normalized.match(/\/([^/]+?)(?:\.(en))?\.md$/)
  if (!match?.[1]) return null
  return {
    slug: match[1],
    lang: match[2] === 'en' ? 'en-US' : 'zh-CN',
  }
}

function listComponentDocPaths(repoRoot: string): string[] {
  const componentsDir = path.join(repoRoot, 'src/components')
  const paths: string[] = []
  for (const name of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue
    const rel = `src/components/${name.name}/docs/index.md`
    if (existsSync(path.join(repoRoot, rel))) paths.push(rel)
  }
  return paths.sort()
}

function listGuideDocPaths(guideDir: string): string[] {
  return readdirSync(guideDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()
}

function buildComponentDocsManifest(repoRoot: string) {
  const manifest: Record<string, Record<'zh-CN' | 'en-US', Record<string, string>>> = {}
  for (const relPath of listComponentDocPaths(repoRoot)) {
    const name = componentNameFromPath(relPath)
    if (!name) continue

    const zhRaw = readFileSync(path.join(repoRoot, relPath), 'utf8')
    const enRel = relPath.replace('/index.md', '/index.en.md')
    const enRaw = existsSync(path.join(repoRoot, enRel))
      ? readFileSync(path.join(repoRoot, enRel), 'utf8')
      : zhRaw

    manifest[name] = {
      'zh-CN': parseYamlFrontmatter(zhRaw),
      'en-US': parseYamlFrontmatter(enRaw),
    }
  }

  return manifest
}

function buildGuideDocsManifest(guideDir: string) {
  const manifest: Record<string, Record<'zh-CN' | 'en-US', Record<string, string>>> = {}
  for (const fileName of listGuideDocPaths(guideDir)) {
    const parsed = guideSlugFromPath(fileName)
    if (!parsed) continue

    const raw = readFileSync(path.join(guideDir, fileName), 'utf8')
    const entry = manifest[parsed.slug] ?? {
      'zh-CN': {},
      'en-US': {},
    }
    entry[parsed.lang] = parseYamlFrontmatter(raw)
    manifest[parsed.slug] = entry
  }

  return manifest
}

export function docsManifestPlugin(repoRoot: string, guideDir: string): Plugin {
  let componentManifest = buildComponentDocsManifest(repoRoot)
  let guideManifest = buildGuideDocsManifest(guideDir)

  function refreshManifests(changedFile?: string) {
    if (!changedFile || changedFile.includes(`${path.sep}docs${path.sep}`)) {
      componentManifest = buildComponentDocsManifest(repoRoot)
    }
    if (!changedFile || changedFile.startsWith(guideDir)) {
      guideManifest = buildGuideDocsManifest(guideDir)
    }
  }

  return {
    name: 'docs-manifest',
    resolveId(id) {
      if (id === COMPONENT_DOCS_MANIFEST_ID) return resolvedComponentManifestId
      if (id === GUIDE_DOCS_MANIFEST_ID) return resolvedGuideManifestId
      return undefined
    },
    load(id) {
      if (id === resolvedComponentManifestId) {
        return `export default ${JSON.stringify(componentManifest)}`
      }
      if (id === resolvedGuideManifestId) {
        return `export default ${JSON.stringify(guideManifest)}`
      }
      return undefined
    },
    configureServer(server) {
      const invalidate = (file: string) => {
        if (!file.includes(`${path.sep}docs${path.sep}`) && !file.startsWith(guideDir)) return
        refreshManifests(file)
        for (const virtualId of [resolvedComponentManifestId, resolvedGuideManifestId]) {
          const mod = server.moduleGraph.getModuleById(virtualId)
          if (mod) server.moduleGraph.invalidateModule(mod)
        }
      }
      server.watcher.on('change', invalidate)
      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)
    },
    handleHotUpdate(ctx) {
      if (!ctx.file.includes(`${path.sep}docs${path.sep}`) && !ctx.file.startsWith(guideDir)) {
        return
      }
      refreshManifests(ctx.file)
      const modules = [
        ctx.server.moduleGraph.getModuleById(resolvedComponentManifestId),
        ctx.server.moduleGraph.getModuleById(resolvedGuideManifestId),
      ].filter(Boolean)
      return modules
    },
  }
}
