import { describe, expect, it } from 'vitest'
import { createToolHandlers } from '../tools.js'

function read<T>(result: { content: Array<{ text: string }> }): T {
  return JSON.parse(result.content[0].text) as T
}

describe('@morya-ui/mcp handlers', () => {
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
    expect(result.exportName).toBe('MTable')
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
        code: '<MButton label="Save" severity="danger" foo="bar" />',
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
        code: '<MButton icon-only aria-label="Add"><Plus /></MButton>',
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
        code: '<MButton icon="plus" icon-only aria-label="Add" />',
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

  it('returns golden-page source as scaffold when available', () => {
    const result = read<{
      matchedPattern: string
      scaffold: { source: string; goldenPage: string; files: { component: string }; warnings: string[] }
      nextStep: string
    }>(
      handlers.recommendPage({
        intent: '生产监控仪表盘',
        pageType: 'dashboard',
        includeScaffold: true,
      }),
    )

    expect(result.matchedPattern).toBe('dashboard')
    expect(result.scaffold.source).toBe('golden-page')
    expect(result.scaffold.goldenPage).toBe('dashboard-page')
    expect(result.scaffold.files.component).toContain('MGrid')
    expect(result.scaffold.files.component).toContain('MPageStat')
    expect(result.scaffold.files.component).toContain('黄金样例')
    expect(result.nextStep).toContain('validate_usage')
  })

  it('prefers list-status-dot for status cell queries', () => {
    const result = read<{ id: string; template: string }>(
      handlers.getPageSnippet({ section: '状态' }),
    )
    expect(result.id).toBe('list-status-dot')
    expect(result.template).toContain('MStatus')
  })

  it('returns result-page golden sample with MResult footer slot', () => {
    const result = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'result-page' }))
    expect(result.id).toBe('result-page')
    expect(result.source).toContain('MResult')
    expect(result.source).toContain('status="403"')
    expect(result.source).toContain('<template #footer>')
    expect(result.source).not.toContain('<template #extra>')
  })

  it('returns settings-page and wizard-form golden samples with correct APIs', () => {
    const settings = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'settings-page' }))
    expect(settings.id).toBe('settings-page')
    expect(settings.source).toContain('MTabs')
    expect(settings.source).toContain(':tabs=')
    expect(settings.source).not.toContain(':items=')

    const wizard = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'wizard-form' }))
    expect(wizard.id).toBe('wizard-form')
    expect(wizard.source).toContain('MStepper')
    expect(wizard.source).toContain(':steps=')
    expect(wizard.source).not.toContain(':items=')
  })

  it('scaffolds settings from golden page source', () => {
    const result = read<{ scaffold: { source: string; goldenPage: string; files: { component: string } } }>(
      handlers.recommendPage({
        intent: '系统设置页',
        pageType: 'settings',
        includeScaffold: true,
      }),
    )
    expect(result.scaffold.source).toBe('golden-page')
    expect(result.scaffold.goldenPage).toBe('settings-page')
    expect(result.scaffold.files.component).toContain(':tabs=')
  })

  it('flags MTabs items and MStepper items as contract advisories', () => {
    const tabs = read<{ suggestions: Array<{ type: string }> }>(
      handlers.validatePage({ code: `<MTabs :items="[]" />` }),
    )
    expect(tabs.suggestions.some((item) => item.type === 'tabs-items-prop')).toBe(true)

    const stepper = read<{ suggestions: Array<{ type: string }> }>(
      handlers.validatePage({ code: `<MStepper :items="['a']" />` }),
    )
    expect(stepper.suggestions.some((item) => item.type === 'stepper-items-prop')).toBe(true)
  })

  it('returns a golden page source sample', () => {
    const result = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'list-page' }))
    expect(result.id).toBe('list-page')
    expect(result.source).toContain('MPageContent')
    expect(result.source).toContain('MPageFilters')
  })

  it('returns a page section snippet by keyword', () => {
    const result = read<{ id: string; template: string; imports: string[] }>(
      handlers.getPageSnippet({ section: 'filters' }),
    )
    expect(result.id).toBe('list-filters')
    expect(result.template).toContain('MPageFilters')
    expect(result.imports).toContain('MPageFilters')
  })

  it('lists page snippets filtered by page type', () => {
    const result = read<{ items: Array<{ id: string }> }>(
      handlers.listPageSnippets({ pageType: 'form', limit: 10 }),
    )
    expect(result.items.some((item) => item.id === 'form-actions')).toBe(true)
    expect(result.items.some((item) => item.id === 'page-content-form')).toBe(true)
    expect(result.items.some((item) => item.id === 'list-filters')).toBe(false)
  })

  it('searches page snippets scope', () => {
    const result = read<{ items: Array<{ type: string; id: string }> }>(
      handlers.search({ query: 'toolbar', scope: 'snippets', limit: 5 }),
    )
    expect(result.items.some((item) => item.type === 'snippet' && item.id === 'list-batch-toolbar')).toBe(true)
  })

  it('suggests double-border page composition as advisory standard', () => {
    const result = read<{ ok: boolean; advisory: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MLayoutContent><MCard><MTable bordered /></MCard></MLayoutContent>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.advisory).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'double-border')).toBe(true)
  })

  it('suggests MScrollbar over inline overflow scroll styles', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string; standardId: string }> }>(
      handlers.validatePage({
        code: '<div style="overflow:auto;height:20rem"><MTable /></div>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'native-scroll' && item.standardId === 'scroll')).toBe(true)
  })

  it('suggests MScrollbar over overflow in style blocks', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<template><div class="panel">x</div></template><style>.panel { max-height: 20rem; overflow-y: auto; }</style>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'native-scroll')).toBe(true)
  })

  it('suggests list fill height only for fillViewport admin lists missing fill', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string; standardId: string }> }>(
      handlers.validatePage({
        code: '<MLayout fill-viewport><MPageContent><MTable :columns="c" :rows="r" paginator /></MPageContent></MLayout>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'list-fill-height' && item.standardId === 'page-sections')).toBe(
      true,
    )
  })

  it('does not suggest list fill when PageContent and Table already fill', () => {
    const result = read<{ suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MLayout fill-viewport><MPageContent fill><MTable fill paginator :columns="c" :rows="r" /></MPageContent></MLayout>',
      }),
    )
    expect(result.suggestions.some((item) => item.type === 'list-fill-height')).toBe(false)
  })

  it('does not suggest list fill for paginator tables outside fillViewport shells', () => {
    const result = read<{ suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MPageContent><MTable :columns="c" :rows="r" paginator /></MPageContent>',
      }),
    )
    expect(result.suggestions.some((item) => item.type === 'list-fill-height')).toBe(false)
  })

  it('returns scrollable-panel snippet for scroll queries', () => {
    const result = read<{ id: string; template: string; imports: string[] }>(
      handlers.getPageSnippet({ section: 'scrollable-panel' }),
    )
    expect(result.id).toBe('scrollable-panel')
    expect(result.template).toContain('MScrollbar')
    expect(result.imports).toContain('MScrollbar')
  })

  it('keeps recommend_page focused on pattern matching', () => {
    const result = read<{ matchedPattern: string; nextStep: string; pageStandards?: unknown; scrollStandards?: unknown }>(
      handlers.recommendPage({ intent: '用户列表页', pageType: 'list' }),
    )
    expect(result.matchedPattern).toBe('admin-list')
    expect(result.nextStep).toContain('validate_usage')
    expect(result.nextStep).toContain('get_golden_page')
    expect(result.pageStandards).toBeUndefined()
    expect(result.scrollStandards).toBeUndefined()
  })

  it('keeps get_golden_page focused on source code', () => {
    const result = read<{ source: string; nextStep: string; pageStandards?: unknown; scrollStandards?: unknown }>(
      handlers.getGoldenPage({ page: 'list-page' }),
    )
    expect(result.source).toContain('MLayout')
    expect(result.nextStep).toContain('validate_usage')
    expect(result.pageStandards).toBeUndefined()
    expect(result.scrollStandards).toBeUndefined()
  })

  it('exposes page standards from get_design_rules', () => {
    const result = read<{ meta: { nature: string }; standards: Array<{ id: string }> }>(
      handlers.getDesignRules({ mode: 'zh-CN' }),
    )
    expect(result.meta.nature).toBe('recommended')
    expect(result.standards.some((item) => item.id === 'scroll')).toBe(true)
    expect(result.standards.some((item) => item.id === 'feedback')).toBe(true)
  })

  it('reads page scroll decision guide by id', () => {
    const result = read<{ id: string; options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'page-scroll-choice' }),
    )
    expect(result.id).toBe('page-scroll-choice')
    expect(result.options.some((option) => option.component === 'MScrollbar')).toBe(true)
  })

  it('suggests redundant wrappers around MPage blocks', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string; standardId: string }> }>(
      handlers.validatePage({
        code: '<MPageContent><div style="padding:24px"><MPageFilters /></div></MPageContent>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(
      result.suggestions.some(
        (item) => item.type === 'redundant-wrapper' && item.standardId === 'page-sections',
      ),
    ).toBe(true)
  })

  it('suggests height-chain when MLayout is used without shell CSS', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MLayout fill-viewport has-sider><MLayoutContent /></MLayout>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'height-chain')).toBe(true)
  })

  it('suggests menu icons when MMenu model has no icon fields', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: `<MMenu :model="[{ key: 'users', label: 'Users', to: '/users' }]" />`,
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'menu-missing-icons')).toBe(true)
  })

  it('does not suggest menu icons when model items include icon', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: `<MMenu :model="[{ key: 'users', label: 'Users', icon: 'user', to: '/users' }]" />`,
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'menu-missing-icons')).toBe(false)
  })

  it('flags MTable data prop as contract advisory', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MTable :columns="columns" :data="rows" />',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'table-data-prop')).toBe(true)
  })

  it('flags MMessage severity as inline-alert misuse', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: '<MMessage severity="error">登录失败</MMessage>',
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'mmessage-as-alert')).toBe(true)
  })

  it('flags one-line toast string as message preference', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: `toast.success('已保存')`,
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'toast-one-liner')).toBe(true)
  })

  it('flags MTag in cell-status when MStatus is missing', () => {
    const result = read<{ ok: boolean; suggestions: Array<{ type: string }> }>(
      handlers.validatePage({
        code: `<template #cell-status="{ value }"><MTag :value="value" /></template>`,
      }),
    )
    expect(result.ok).toBe(true)
    expect(result.suggestions.some((item) => item.type === 'status-cell-tag')).toBe(true)
  })

  it('returns detail-page and form-in-dialog golden samples', () => {
    const detail = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'detail-page' }))
    expect(detail.id).toBe('detail-page')
    expect(detail.source).toContain('MPageHeader')
    expect(detail.source).toContain('MStatus')

    const dialog = read<{ id: string; source: string }>(handlers.getGoldenPage({ page: 'form-in-dialog' }))
    expect(dialog.id).toBe('form-in-dialog')
    expect(dialog.source).toContain('MDialog')
    expect(dialog.source).toContain('message.success')
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

  it('returns L2 recipes and antiPatterns on decision reads', () => {
    const result = read<{
      options: Array<{
        component: string
        recipe?: { props?: string[]; slots?: string[]; events?: string[] }
        antiPatterns?: string[]
      }>
    }>(handlers.recommendComponent({ decision: 'data-display-choice' }))

    const table = result.options.find((option) => option.component === 'Table')
    expect(table?.recipe?.props?.length).toBeGreaterThanOrEqual(3)
    expect(table?.recipe?.props?.some((line) => /rows/i.test(line))).toBe(true)
    expect(table?.antiPatterns?.length).toBeGreaterThan(0)
  })

  it('covers feedback and confirm decision guides', () => {
    const feedback = read<{ options: Array<{ component: string; recipe?: { props?: string[] } }> }>(
      handlers.recommendComponent({ decision: 'feedback-choice' }),
    )
    expect(feedback.options.map((option) => option.component)).toEqual(
      expect.arrayContaining(['message', 'toast', 'field errorMessage / role="alert"']),
    )
    expect(feedback.options.every((option) => (option.recipe?.props?.length ?? 0) >= 3)).toBe(true)

    const confirm = read<{ options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'confirm-choice' }),
    )
    expect(confirm.options.map((option) => option.component)).toEqual([
      'ConfirmDialog',
      'ConfirmPopup',
    ])
  })

  it('covers current selection, status, empty, and menu guides', () => {
    const selection = read<{ options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'selection-choice' }),
    )
    expect(selection.options.map((option) => option.component)).toEqual(
      expect.arrayContaining(['Select', 'CascadeSelect', 'Listbox', 'SelectButton', 'Radio']),
    )

    const status = read<{ id: string }>(handlers.recommendComponent({ decision: 'status-label-choice' }))
    expect(status.id).toBe('status-label-choice')
    const empty = read<{ options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'empty-result-choice' }),
    )
    expect(empty.options.map((option) => option.component)).toEqual(['Empty', 'Result'])
    const menu = read<{ options: Array<{ component: string }> }>(
      handlers.recommendComponent({ decision: 'action-menu-choice' }),
    )
    expect(menu.options.some((option) => option.component === 'ContextMenu')).toBe(true)
  })

  it('exposes catalog health in version metadata', () => {
    const result = read<{
      health: { ok: boolean; patternReferences: unknown[] }
      counts: { patterns: number; decisions: number; resources: number; resourceTemplates: number }
      tools: string[]
    }>(handlers.version())

    expect(result.health.ok).toBe(true)
    expect(result.health.patternReferences).toEqual([])
    expect(result.counts.patterns).toBeGreaterThan(0)
    expect(result.counts.decisions).toBeGreaterThan(0)
    expect(result.counts.resources).toBeGreaterThan(100)
    expect(result.counts.resourceTemplates).toBe(3)
    expect(result.tools).toHaveLength(18)
    expect(result.tools).toContain('get_golden_page')
    expect(result.tools).toContain('get_page_snippet')
    expect(result.tools).toContain('validate_page')
    expect(result.tools).not.toContain('create_page')
  })
})
