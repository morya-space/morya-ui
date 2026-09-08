import { describe, expect, it } from 'vitest'
import {
  getComponentDefault,
  getComponentDefaults,
  mergeComponentDefaults,
} from './componentDefaults'
import { mergeWkConfig } from './config'

describe('componentDefaults', () => {
  it('reads unprefixed keys and Wk aliases', () => {
    expect(getComponentDefault({ Input: { size: 'small' } }, 'WkInput', 'size')).toBe('small')
    expect(getComponentDefaults({ WkSpace: { size: 12 } }, 'Space')).toEqual({ size: 12 })
    expect(getComponentDefaults({ Input: { size: 'small' }, WkInput: { clearable: true } }, 'Input')).toEqual({
      size: 'small',
      clearable: true,
    })
  })

  it('merges nested maps with child props winning', () => {
    const merged = mergeComponentDefaults(
      { Input: { size: 'small', clearable: true }, Space: { size: 'large' } },
      { Input: { size: 'large' }, Button: { size: 'small' } },
    )
    expect(merged).toEqual({
      Input: { size: 'large', clearable: true },
      Space: { size: 'large' },
      Button: { size: 'small' },
    })
  })
})

describe('mergeWkConfig', () => {
  it('inherits parent keys and merges locale / componentDefaults', () => {
    const merged = mergeWkConfig(
      {
        size: 'small',
        appendTo: 'body',
        locale: { accept: 'OK', reject: 'No' },
        componentDefaults: { Space: { size: 8 } },
      },
      {
        density: 'compact',
        locale: { accept: 'Yes' },
        componentDefaults: { Input: { clearable: true } },
      },
    )
    expect(merged.size).toBe('small')
    expect(merged.appendTo).toBe('body')
    expect(merged.density).toBe('compact')
    expect(merged.locale).toEqual({ accept: 'Yes', reject: 'No' })
    expect(merged.componentDefaults).toEqual({
      Space: { size: 8 },
      Input: { clearable: true },
    })
  })
})
