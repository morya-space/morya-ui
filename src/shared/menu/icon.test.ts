import { describe, expect, it } from 'vitest'
import { resolveMenuIcon, resolveMenuIconComponent } from './icon'

describe('resolveMenuIcon', () => {
  it('returns undefined for missing or unknown icons', () => {
    expect(resolveMenuIcon()).toBeUndefined()
    expect(resolveMenuIcon('not-a-real-icon')).toBeUndefined()
  })

  it('returns registered icon names', () => {
    expect(resolveMenuIcon('check')).toBe('check')
    expect(resolveMenuIcon('shield')).toBe('shield')
  })

  it('maps common external icon aliases', () => {
    // Names that are now registered resolve directly…
    expect(resolveMenuIcon('layout-dashboard')).toBe('layout-dashboard')
    expect(resolveMenuIcon('users-group')).toBe('users-group')
    // …while unregistered aliases still fall back to a built-in icon.
    expect(resolveMenuIcon('report-analytics')).toBe('chart-bar')
    expect(resolveMenuIcon('user-shield')).toBe('shield-check')
  })
})

describe('resolveMenuIconComponent', () => {
  it('returns undefined for string icons', () => {
    expect(resolveMenuIconComponent('check')).toBeUndefined()
    expect(resolveMenuIconComponent('not-a-real-icon')).toBeUndefined()
  })

  it('returns undefined for missing icon', () => {
    expect(resolveMenuIconComponent()).toBeUndefined()
  })

  it('returns the component for custom component icons', () => {
    const CustomIcon = { template: '<svg><path d="M0 0h24v24H0z"/></svg>' }
    expect(resolveMenuIconComponent(CustomIcon)).toBe(CustomIcon)
  })
})
