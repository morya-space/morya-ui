import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useControllable } from './useControllable'

describe('useControllable', () => {
  it('uses internal state when uncontrolled', () => {
    const updates: boolean[] = []
    const { value, setValue } = useControllable(
      { controlled: () => undefined, defaultValue: false },
      (next) => updates.push(next),
    )

    expect(value.value).toBe(false)
    setValue(true)
    expect(value.value).toBe(true)
    expect(updates).toEqual([true])
  })

  it('follows controlled value and does not mutate internal state', () => {
    const controlled = ref(false)
    const { value, setValue } = useControllable(
      { controlled: () => controlled.value, defaultValue: true },
      () => {},
    )

    expect(value.value).toBe(false)
    setValue(true)
    expect(value.value).toBe(false)
    controlled.value = true
    expect(value.value).toBe(true)
  })
})
