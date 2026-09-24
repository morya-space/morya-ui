import { describe, expect, it } from 'vitest'
import { resolveGap, resolveGapCSSValue, resolveGapLength } from './gap'

describe('resolveGapLength', () => {
  it('maps tokens and numbers', () => {
    expect(resolveGapLength('small')).toBe('var(--m-space-2)')
    expect(resolveGapLength(16)).toBe('16px')
    expect(resolveGapLength('16')).toBe('16px')
  })

  it('passes through CSS length strings', () => {
    expect(resolveGapLength('1rem')).toBe('1rem')
    expect(resolveGapLength('8px')).toBe('8px')
    expect(resolveGapLength('var(--m-space-4)')).toBe('var(--m-space-4)')
  })
})

describe('resolveGap', () => {
  it('supports string sizes and mixed tuples', () => {
    expect(resolveGap('1rem').css).toBe('1rem')
    expect(resolveGap(['8px', '1rem']).css).toBe('1rem 8px')
    expect(resolveGap([8, '1rem']).css).toBe('1rem 8px')
  })
})

describe('resolveGapCSSValue', () => {
  it('returns 0 for empty and passes CSS strings', () => {
    expect(resolveGapCSSValue(null)).toBe('0')
    expect(resolveGapCSSValue('')).toBe('0')
    expect(resolveGapCSSValue('2rem')).toBe('2rem')
  })
})
