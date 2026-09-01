import { describe, expect, it } from 'vitest'
import { createToolHandlers } from '../tools.js'

function read<T>(result: { content: Array<{ text: string }> }): T {
  return JSON.parse(result.content[0].text) as T
}

describe('@well-insight/ui-mcp handlers', () => {
  const handlers = createToolHandlers()

  it('returns complete pagination metadata for component lists', () => {
    const result = read<{
      total: number
      count: number
      offset: number
      limit: number
      has_more: boolean
      next_offset?: number
    }>(handlers.list({ kind: 'components', limit: 5, offset: 5 }))

    expect(result.total).toBeGreaterThan(5)
    expect(result.count).toBe(5)
    expect(result.offset).toBe(5)
    expect(result.limit).toBe(5)
    expect(result.has_more).toBe(true)
    expect(result.next_offset).toBe(10)
  })

  it('paginates categories instead of returning the complete collection', () => {
    const result = read<{ items: unknown[]; count: number }>(
      handlers.list({ kind: 'categories', limit: 1, offset: 1 }),
    )

    expect(result.items).toHaveLength(1)
    expect(result.count).toBe(1)
  })

  it('resolves documented aliases when reading component API', () => {
    const result = read<{ id: string; exportName: string }>(
      handlers.getComponent({ component: '数据表格', includeApi: true }),
    )

    expect(result.id).toBe('Table')
    expect(result.exportName).toBe('WiTable')
  })

  it('paginates component examples and reports API coverage', () => {
    const first = read<{
      examples: Array<{ id: string }>
      exampleCount: number
      examplesOffset: number
      examplesLimit: number
      hasMoreExamples: boolean
      nextExamplesOffset?: number
      apiCoverage: { props: { total: number }; events: { total: number }; slots: { total: number } }
    }>(handlers.getComponent({ component: 'Table', detail: 'full', examplesLimit: 1 }))

    expect(first.examples).toHaveLength(1)
    expect(first.exampleCount).toBeGreaterThan(1)
    expect(first.examplesOffset).toBe(0)
    expect(first.examplesLimit).toBe(1)
    expect(first.hasMoreExamples).toBe(true)
    expect(first.nextExamplesOffset).toBe(1)
    expect(first.apiCoverage.props.total).toBeGreaterThan(0)

    const second = read<{ examples: Array<{ id: string }>; examplesOffset: number }>(
      handlers.getComponent({ component: 'Table', detail: 'full', examplesLimit: 1, examplesOffset: 1 }),
    )
    expect(second.examplesOffset).toBe(1)
    expect(second.examples[0]?.id).not.toBe(first.examples[0]?.id)
  })

  it('reports unknown props without rejecting valid props', () => {
    const result = read<{ ok: boolean; issues: Array<{ type: string; message: string }> }>(
      handlers.validateUsage({
        component: 'Button',
        code: '<WiButton label="Save" severity="danger" foo="bar" />',
      }),
    )

    expect(result.ok).toBe(false)
    expect(result.issues).toEqual([
      expect.objectContaining({ type: 'unknown-prop' }),
    ])
    expect(result.issues[0].message).toContain('foo')
  })

  it('flags icon-only buttons that put icons in the default slot', () => {
    const result = read<{ ok: boolean; issues: Array<{ type: string }> }>(
      handlers.validateUsage({
        component: 'Button',
        code: '<WiButton icon-only aria-label="Add"><Plus /></WiButton>',
      }),
    )

    expect(result.ok).toBe(false)
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'icon-only-missing-icon' }),
        expect.objectContaining({ type: 'icon-only-default-slot' }),
      ]),
    )
  })

  it('accepts icon-only buttons with icon prop', () => {
    const result = read<{ ok: boolean }>(
      handlers.validateUsage({
        component: 'Button',
        code: '<WiButton icon="plus" icon-only aria-label="Add" />',
      }),
    )

    expect(result.ok).toBe(true)
  })

  it('recommends a page pattern from product intent', () => {
    const result = read<{ matchedPattern: string }>(
      handlers.recommendPage({
        intent: '油井管理列表',
        pageType: 'list',
        features: ['筛选', '分页'],
      }),
    )

    expect(result.matchedPattern).toBe('admin-list')
  })

  it('returns a dashboard scaffold when includeScaffold is true', () => {
    const result = read<{ matchedPattern: string; scaffold: { files: { component: string } } }>(
      handlers.recommendPage({
        intent: '生产监控仪表盘',
        pageType: 'dashboard',
        includeScaffold: true,
      }),
    )

    expect(result.matchedPattern).toBe('dashboard')
    expect(result.scaffold.files.component).toContain('WiProgressBar')
    expect(result.scaffold.files.component).toContain('WiSkeleton')
  })

  it('lists component decision guides when query is omitted', () => {
    const result = read<{ kind: string; items: Array<{ id: string }> }>(
      handlers.recommendComponent({ limit: 5 }),
    )

    expect(result.kind).toBe('decisions')
    expect(result.items.length).toBeGreaterThan(0)
    expect(result.items[0]?.id).toBeTruthy()
  })

  it('reads a decision guide by id', () => {
    const result = read<{ id: string; options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'overlay-choice' }),
    )

    expect(result.id).toBe('overlay-choice')
    expect(result.options.some((option) => option.component === 'Drawer')).toBe(true)
  })

  it('exposes catalog health in version metadata', () => {
    const result = read<{
      health: { ok: boolean; patternReferences: unknown[] }
      counts: { patterns: number; decisions: number; resources: number }
      tools: string[]
    }>(handlers.version())

    expect(result.health.ok).toBe(true)
    expect(result.health.patternReferences).toEqual([])
    expect(result.counts.patterns).toBeGreaterThan(0)
    expect(result.counts.decisions).toBeGreaterThan(0)
    expect(result.counts.resources).toBeGreaterThan(100)
    expect(result.tools).toHaveLength(13)
    expect(result.tools).not.toContain('create_page')
  })
})
