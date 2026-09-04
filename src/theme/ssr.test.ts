import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyTheme } from './index'
import { applyDensity } from './useDensity'
import { applyMotion } from './useMotion'

describe('theme SSR guards', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('applyTheme no-ops without document', () => {
    vi.stubGlobal('document', undefined)
    expect(() => applyTheme('dark')).not.toThrow()
  })

  it('applyDensity no-ops without document', () => {
    vi.stubGlobal('document', undefined)
    expect(() => applyDensity('compact')).not.toThrow()
  })

  it('applyMotion no-ops without document', () => {
    vi.stubGlobal('document', undefined)
    expect(() => applyMotion('none')).not.toThrow()
  })
})
