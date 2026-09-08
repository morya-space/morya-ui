import { describe, expect, it } from 'vitest'
import { applyDensity } from './useDensity'

describe('applyDensity', () => {
  it('writes data-wk-density on the target element', () => {
    const el = document.createElement('div')
    applyDensity('compact', el)
    expect(el.dataset.wkDensity).toBe('compact')
    applyDensity('spacious', el)
    expect(el.dataset.wkDensity).toBe('spacious')
  })
})
