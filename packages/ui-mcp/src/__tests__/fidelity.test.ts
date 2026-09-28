import { describe, expect, it } from 'vitest'
import { codeCoversBlock, mapReferenceBrief } from '../reference-brief.js'
import { findStyleShell, listStyleShells } from '../style-shells.js'
import { createToolHandlers } from '../tools.js'

function read<T>(result: { content: Array<{ type: string; text: string }> }): T {
  return JSON.parse(result.content[0].text) as T
}

describe('reference brief mapping', () => {
  it('maps list brief to filters/table/status snippets', () => {
    const mapped = mapReferenceBrief({
      intent: '油井管理列表',
      surface: 'list',
      density: 'compact',
      requiredBlocks: ['filters', 'table', 'status'],
      primaryAction: '新建油井',
    })
    expect(mapped.surface).toBe('ops-list')
    expect(mapped.density).toBe('compact')
    expect(mapped.suggestedSnippets).toContain('list-filters-dense')
    expect(mapped.suggestedSnippets).toContain('list-table')
    expect(mapped.suggestedShellId).toBe('ops-quiet')
    expect(mapped.craftCuesZh.some((line) => line.includes('新建油井'))).toBe(true)
  })

  it('detects covered blocks in generated code', () => {
    const code = '<MPageFilters /><MTable /><MStatus label="启用" />'
    expect(codeCoversBlock(code, 'filters')).toBe(true)
    expect(codeCoversBlock(code, 'table')).toBe(true)
    expect(codeCoversBlock(code, 'status')).toBe(true)
    expect(codeCoversBlock(code, 'kpi')).toBe(false)
  })
})

describe('style shells', () => {
  it('lists and finds account-split shell with CSS', () => {
    expect(listStyleShells('account').some((s) => s.id === 'account-split')).toBe(true)
    const shell = findStyleShell('account-split')
    expect(shell?.css).toContain('--m-color-primary')
    expect(shell?.css).not.toMatch(/#[0-9a-f]{3,8}/i)
  })
})

describe('fidelity tools', () => {
  const handlers = createToolHandlers()

  it('map_reference returns mapping and shell', () => {
    const result = read<{
      suggestedSnippets: string[]
      mapping: Array<{ snippetId: string }>
      styleShell: { id: string; css: string } | null
    }>(
      handlers.mapReference({
        description: '登录页左侧品牌栏，右侧邮箱密码表单',
        surface: 'account',
      }),
    )
    expect(result.suggestedSnippets).toContain('auth-split-shell')
    expect(result.styleShell?.id).toBe('account-split')
    expect(result.styleShell?.css).toContain('login-brand')
  })

  it('recommend_page accepts density and brief', () => {
    const result = read<{
      density: string
      suggestedSnippets: string[]
      referenceMapping: { density: string; mapping: unknown[] } | null
    }>(
      handlers.recommendPage({
        intent: '设备台账列表',
        pageType: 'list',
        density: 'compact',
        brief: {
          description: '高密筛选 + 状态列',
          requiredBlocks: ['filters', 'table', 'status'],
        },
      }),
    )
    expect(result.density).toBe('compact')
    expect(result.suggestedSnippets).toContain('list-filters-dense')
    expect(result.referenceMapping?.mapping.length).toBeGreaterThan(0)
  })

  it('validate_page fails contract when brief blocks are missing', () => {
    const result = read<{
      ok: boolean
      contract: Array<{ type: string }>
      craft: Array<{ type: string }>
    }>(
      handlers.validatePage({
        code: '<MPageContent><MTable :rows="[]" /></MPageContent>',
        brief: {
          surface: 'list',
          requiredBlocks: ['filters', 'table', 'status'],
        },
      }),
    )
    expect(result.ok).toBe(false)
    expect(result.contract.some((item) => item.type === 'brief-missing-block')).toBe(true)
  })

  it('validate_page flags placeholder copy as craft', () => {
    const result = read<{
      ok: boolean
      craft: Array<{ type: string }>
    }>(
      handlers.validatePage({
        code: '<MEmpty title="暂无数据" description="示例" />',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.craft.some((item) => item.type === 'placeholder-copy')).toBe(true)
  })

  it('get_style_shells returns pasteable css', () => {
    const result = read<{ id: string; css: string }>(handlers.getStyleShells({ shell: 'express-hero' }))
    expect(result.id).toBe('express-hero')
    expect(result.css).toContain('landing-hero')
  })
})
