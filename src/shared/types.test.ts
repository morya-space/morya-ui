import { describe, expect, it } from 'vitest'
import { resolveIconSize, resolveSizeClass } from './types'

describe('resolveSizeClass', () => {
  it('normalizes legacy size aliases', () => {
    expect(resolveSizeClass('sm')).toBe('small')
    expect(resolveSizeClass('lg')).toBe('large')
    expect(resolveSizeClass(undefined)).toBe('normal')
  })
})

describe('resolveIconSize', () => {
  it('maps control sizes to icon tokens', () => {
    expect(resolveIconSize('sm')).toBe('sm')
    expect(resolveIconSize('small')).toBe('sm')
    expect(resolveIconSize(undefined)).toBe('md')
    expect(resolveIconSize('md')).toBe('md')
    expect(resolveIconSize('lg')).toBe('lg')
    expect(resolveIconSize('large')).toBe('lg')
  })
})
