import { describe, expect, it } from 'vitest'
import { resolveMenuIcon } from './icon'

describe('resolveMenuIcon', () => {
  it('returns undefined for missing or unknown icons', () => {
    expect(resolveMenuIcon()).toBeUndefined()
    expect(resolveMenuIcon('not-a-real-icon')).toBeUndefined()
  })

  it('returns registered icon names', () => {
    expect(resolveMenuIcon('check')).toBe('check')
  })
})
