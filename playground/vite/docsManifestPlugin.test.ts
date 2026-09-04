import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { docsManifestPlugin, GUIDE_DOCS_MANIFEST_ID } from './docsManifestPlugin.ts'

const repoRoot = process.cwd()
const guideDir = path.join(repoRoot, 'playground/src/docs/guide')

describe('docsManifestPlugin', () => {
  it('builds guide manifest from bare markdown filenames', () => {
    const plugin = docsManifestPlugin(repoRoot, guideDir)
    const code = plugin.load(`\0${GUIDE_DOCS_MANIFEST_ID}`)
    expect(code).toBeTruthy()

    const manifest = Function(`return ${code!.replace('export default ', '')}`)() as Record<
      string,
      Record<'zh-CN' | 'en-US', Record<string, string>>
    >

    expect(Object.keys(manifest).sort()).toEqual([
      'accessibility',
      'config',
      'guide',
      'introduction',
      'mcp',
      'quick-start',
      'ssr',
      'theme',
    ])
    expect(manifest.introduction['zh-CN'].title).toBe('介绍')
  })
})
