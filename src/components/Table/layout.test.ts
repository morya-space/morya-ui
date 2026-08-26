import { describe, expect, it } from 'vitest'
import { computeColumnLayout, TABLE_DEFAULT_MIN_WIDTH, TABLE_SELECTION_WIDTH } from './layout'

describe('computeColumnLayout', () => {
  it('distributes leftover width to flex columns by minWidth (fit)', () => {
    const result = computeColumnLayout(
      [
        { key: 'name', label: 'Name', width: 100 },
        { key: 'role', label: 'Role', minWidth: 80 },
        { key: 'city', label: 'City', minWidth: 120 },
      ],
      400,
      { fit: true },
    )
    expect(result.scrollX).toBe(false)
    expect(result.columns.find((c) => c.key === 'name')?.realWidth).toBe(100)
    const role = result.columns.find((c) => c.key === 'role')!.realWidth
    const city = result.columns.find((c) => c.key === 'city')!.realWidth
    expect(role + city).toBe(300)
    expect(city).toBeGreaterThan(role)
  })

  it('falls back to minWidth when content overflows', () => {
    const result = computeColumnLayout(
      [
        { key: 'a', label: 'A', minWidth: 200 },
        { key: 'b', label: 'B', minWidth: 200 },
      ],
      300,
      { fit: true },
    )
    expect(result.scrollX).toBe(true)
    expect(result.columns.every((c) => c.realWidth === 200)).toBe(true)
  })

  it('defaults missing minWidth to 80 and reserves selection column', () => {
    const result = computeColumnLayout([{ key: 'name', label: 'Name' }], 500, {
      fit: true,
      selection: true,
    })
    expect(result.columns[0]?.key).toBe('__selection__')
    expect(result.columns[0]?.realWidth).toBe(TABLE_SELECTION_WIDTH)
    expect(result.columns[1]?.realWidth).toBe(500 - TABLE_SELECTION_WIDTH)
    expect(TABLE_DEFAULT_MIN_WIDTH).toBe(80)
  })

  it('reserves an expand column after selection', () => {
    const result = computeColumnLayout([{ key: 'name', label: 'Name', width: 100 }], 400, {
      selection: true,
      expand: true,
      fit: false,
    })
    expect(result.columns.map((c) => c.key)).toEqual(['__selection__', '__expand__', 'name'])
  })
})
