import type { Plugin, ViteDevServer } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import MarkdownPreview from 'vite-plugin-markdown-preview'

type MarkdownPreviewOptions = {
  component?: string
}

function parseMeta(meta: string) {
  const ret: Record<string, string | true> = {}
  for (const part of meta.split(/\s+/).filter(Boolean)) {
    const eq = part.indexOf('=')
    if (eq === -1) {
      ret[part] = true
      continue
    }
    const key = part.slice(0, eq)
    let val = part.slice(eq + 1)
    if (
      (val.startsWith('"') && val.endsWith('"'))
      || (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    ret[key] = val
  }
  return ret
}

/** Inline `src="./demos/Foo.vue"` fences so vite-plugin-markdown-preview can render them. */
export function expandDemoSrc(mdId: string, code: string): { code: string; deps: string[] } {
  const deps: string[] = []
  const fenceRe = /```vue([^\n]*)\n([\s\S]*?)```/g
  const next = code.replace(fenceRe, (full, metaRaw: string) => {
    const meta = parseMeta(metaRaw)
    if (!meta.preview) return full
    const src = meta.src
    if (typeof src !== 'string' || !src) return full

    const abs = path.resolve(path.dirname(mdId), src)
    if (!fs.existsSync(abs)) {
      throw new Error(`[markdown-preview] Demo not found for ${mdId}: ${src}`)
    }
    deps.push(abs)
    const content = fs.readFileSync(abs, 'utf8').replace(/\s*$/, '')
    const cleanedMeta = metaRaw
      .replace(/\s*src=(?:"[^"]*"|'[^']*'|[^\s]+)/, '')
      .replace(/\s+/g, ' ')
      .trim()
    return `\`\`\`vue ${cleanedMeta}\n${content}\n\`\`\``
  })
  return { code: next, deps }
}

/**
 * Wraps vite-plugin-markdown-preview with `src="./demos/*.vue"` support.
 * Demo SFCs are the source of truth for zh/en docs.
 */
export function markdownPreviewPlugin(options: MarkdownPreviewOptions = {}): Plugin[] {
  const inner = MarkdownPreview(options) as Plugin
  const mdDeps = new Map<string, string[]>()
  const originalLoad = inner.load?.bind(inner)
  const originalHmr = inner.handleHotUpdate?.bind(inner)

  const wrapper: Plugin = {
    ...inner,
    name: 'vite:markdown-preview-with-src',
    async load(id, opts) {
      if (!originalLoad) return
      if (!id.endsWith('.md')) return originalLoad(id, opts)

      const raw = fs.readFileSync(id, 'utf8')
      const { code, deps } = expandDemoSrc(id, raw)
      mdDeps.set(path.resolve(id), deps)
      for (const dep of deps) this.addWatchFile(dep)

      if (code === raw) return originalLoad(id, opts)

      const read = fs.readFileSync
      const resolvedId = path.resolve(id)
      ;(fs as typeof fs & { readFileSync: typeof read }).readFileSync = ((
        file: fs.PathOrFileDescriptor,
        encoding?: BufferEncoding | { encoding?: BufferEncoding } | null,
      ) => {
        const filePath = typeof file === 'string' || file instanceof URL
          ? path.resolve(String(file))
          : null
        if (filePath === resolvedId) {
          if (encoding == null || encoding === undefined) return Buffer.from(code)
          if (typeof encoding === 'string') return code
          if (typeof encoding === 'object' && encoding?.encoding) return code
          return Buffer.from(code)
        }
        return (read as Function).call(fs, file, encoding)
      }) as typeof read

      try {
        return await originalLoad(id, opts)
      }
      finally {
        fs.readFileSync = read
      }
    },
    async handleHotUpdate(ctx) {
      const file = path.resolve(ctx.file)
      const parents: string[] = []
      for (const [md, deps] of mdDeps) {
        if (deps.some(d => path.resolve(d) === file)) parents.push(md)
      }

      if (parents.length > 0) {
        const { moduleGraph } = ctx.server as ViteDevServer
        const updates = []
        for (const md of parents) {
          for (const mod of moduleGraph.fileToModulesMap.get(md) ?? []) {
            moduleGraph.invalidateModule(mod)
            updates.push(mod)
          }
          // Also re-run markdown-preview virtual demo blocks via md hmr
          if (originalHmr) {
            const ret = await originalHmr({
              ...ctx,
              file: md,
              modules: [...(moduleGraph.fileToModulesMap.get(md) ?? [])],
              read: () => fs.readFileSync(md, 'utf8'),
            })
            if (ret) updates.push(...ret)
          }
        }
        return updates.filter(Boolean)
      }

      return originalHmr?.(ctx)
    },
  }

  return [wrapper]
}
