import { describe, expect, it } from 'vitest'
import { filterPageSnippets, findPageSnippet, scorePageSnippet } from '../page-snippets.js'

describe('page snippets catalog', () => {
  it('finds snippet by exact id', () => {
    expect(findPageSnippet('form-actions')?.id).toBe('form-actions')
  })

  it('scores keyword matches for fuzzy lookup', () => {
    const snippet = findPageSnippet('list-filters')!
    expect(scorePageSnippet(snippet, 'filters')).toBeGreaterThan(0)
    expect(scorePageSnippet(snippet, 'search')).toBeGreaterThan(0)
  })

  it('filters snippets by page type', () => {
    const result = filterPageSnippets({ pageType: 'dashboard' })
    expect(result.items.some((item) => item.id === 'dashboard-kpi-grid')).toBe(true)
    expect(result.items.some((item) => item.id === 'list-filters')).toBe(false)
  })
})
