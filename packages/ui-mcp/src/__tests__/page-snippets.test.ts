import { describe, expect, it } from 'vitest'
import { filterPageSnippets, findPageSnippet, scorePageSnippet } from '../page-snippets.js'

describe('page snippets catalog', () => {
  it('finds composition-first snippets by id', () => {
    for (const id of [
      'form-in-dialog',
      'form-in-drawer',
      'confirm-delete',
      'row-actions-menu',
      'wizard-steps',
      'auth-split-shell',
      'page-header-actions',
      'list-filters-stack',
      'list-filters-dense',
    ]) {
      expect(findPageSnippet(id)?.id).toBe(id)
    }
  })

  it('list-filters-stack includes chips, advanced, and #actions', () => {
    const stack = findPageSnippet('list-filters-stack')!
    expect(stack.template).toContain('MPageFilterChips')
    expect(stack.template).toContain('#advanced')
    expect(stack.template).toContain('#actions')
    expect(stack.template).toContain('collapsible')
    expect(stack.scriptSetup).toContain('activeFilters')
    expect(stack.scriptSetup).toContain('resetFilters')
  })

  it('scores filter stack keywords', () => {
    const stack = findPageSnippet('list-filters-stack')!
    expect(scorePageSnippet(stack, '筛选组合')).toBeGreaterThan(0)
    expect(scorePageSnippet(stack, 'filter stack')).toBeGreaterThan(0)
  })

  it('finds snippet by exact id', () => {
    expect(findPageSnippet('form-actions')?.id).toBe('form-actions')
  })

  it('scores keyword matches for fuzzy lookup', () => {
    const snippet = findPageSnippet('list-filters')!
    expect(scorePageSnippet(snippet, 'filters')).toBeGreaterThan(0)
    expect(scorePageSnippet(snippet, 'search')).toBeGreaterThan(0)
  })

  it('list-table includes status, numeric align, and domain empty copy', () => {
    const table = findPageSnippet('list-table')!
    expect(table.template).toContain('MStatus')
    expect(table.scriptSetup).toContain("align: 'end'")
    expect(table.template).toContain('tabular-nums')
    expect(table.template).toContain('还没有成员')
    expect(table.imports).toContain('MStatus')
  })

  it('form-body sets label-width and domain placeholders', () => {
    const form = findPageSnippet('form-body')!
    expect(form.template).toContain('label-width')
    expect(form.template).toContain('MSelect')
  })
})
