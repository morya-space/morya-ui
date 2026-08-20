import { describe, expect, it } from 'vitest'
import { applyDensity } from './useDensity'

describe('applyDensity', () => {
  it('writes data-wi-density on the target element', () => {
    const el = document.createElement('div')
    applyDensity('compact', el)
    expect(el.dataset.wiDensity).toBe('compact')
    applyDensity('spacious', el)
    expect(el.dataset.wiDensity).toBe('spacious')
  })
})
