import { describe, expect, it } from 'vitest'
import { applyDensity } from './useDensity'

describe('applyDensity', () => {
  it('writes data-m-density on the target element', () => {
    const el = document.createElement('div')
    applyDensity('compact', el)
    expect(el.dataset.muDensity).toBe('compact')
    applyDensity('spacious', el)
    expect(el.dataset.muDensity).toBe('spacious')
  })
})
