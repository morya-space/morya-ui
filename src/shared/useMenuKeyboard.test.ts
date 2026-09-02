import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useMenuKeyboard } from './useMenuKeyboard'

function keydown(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent
}

describe('useMenuKeyboard', () => {
  it('moves with vertical arrows and wraps at both ends', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({ itemCount: 3 })
    expect(activeIndex.value).toBe(-1)

    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(2)
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
    onKeydown(keydown('ArrowUp'))
    expect(activeIndex.value).toBe(2)
  })

  it('preventDefaults handled keys', () => {
    const { onKeydown } = useMenuKeyboard({ itemCount: 2 })
    const event = keydown('ArrowDown')
    onKeydown(event)
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('uses horizontal arrows in horizontal mode and ignores vertical ones', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({
      itemCount: 3,
      orientation: 'horizontal',
    })
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(-1)
    onKeydown(keydown('ArrowRight'))
    expect(activeIndex.value).toBe(0)
    onKeydown(keydown('ArrowRight'))
    onKeydown(keydown('ArrowLeft'))
    expect(activeIndex.value).toBe(0)
  })

  it('supports both orientations at once', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({ itemCount: 3, orientation: 'both' })
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
    onKeydown(keydown('ArrowRight'))
    expect(activeIndex.value).toBe(1)
    onKeydown(keydown('ArrowLeft'))
    expect(activeIndex.value).toBe(0)
  })

  it('skips disabled items in both directions', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({
      itemCount: 4,
      isItemDisabled: (index) => index === 1 || index === 2,
    })
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(3)
    onKeydown(keydown('ArrowUp'))
    expect(activeIndex.value).toBe(0)
  })

  it('keeps the highlight when every item is disabled', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({
      itemCount: 2,
      isItemDisabled: () => true,
    })
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('Home'))
    expect(activeIndex.value).toBe(-1)
  })

  it('does not wrap when wrap is false', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({ itemCount: 2, wrap: false })
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(1)
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(1)
    onKeydown(keydown('ArrowUp'))
    onKeydown(keydown('ArrowUp'))
    expect(activeIndex.value).toBe(0)
  })

  it('jumps to the first and last enabled items with Home and End', () => {
    const { activeIndex, onKeydown } = useMenuKeyboard({
      itemCount: 4,
      isItemDisabled: (index) => index === 0 || index === 3,
    })
    onKeydown(keydown('End'))
    expect(activeIndex.value).toBe(2)
    onKeydown(keydown('Home'))
    expect(activeIndex.value).toBe(1)
  })

  it('activates the highlighted item on Enter and Space', () => {
    const onActivate = vi.fn()
    const { onKeydown } = useMenuKeyboard({ itemCount: 3, onActivate })

    const idleEnter = keydown('Enter')
    onKeydown(idleEnter)
    expect(onActivate).not.toHaveBeenCalled()
    expect(idleEnter.preventDefault).not.toHaveBeenCalled()

    onKeydown(keydown('ArrowDown'))
    const enter = keydown('Enter')
    onKeydown(enter)
    expect(onActivate).toHaveBeenCalledWith(0, enter)
    expect(enter.preventDefault).toHaveBeenCalled()

    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown(' '))
    expect(onActivate).toHaveBeenCalledWith(1, expect.anything())
  })

  it('does not activate a disabled highlighted item', () => {
    const onActivate = vi.fn()
    const { setActive, onKeydown } = useMenuKeyboard({
      itemCount: 2,
      isItemDisabled: (index) => index === 1,
      onActivate,
    })
    setActive(1)
    onKeydown(keydown('Enter'))
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('calls onEscape on Escape and returns focus to the trigger', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    const returnFocusTo = ref<HTMLElement | null>(trigger)
    const onEscape = vi.fn()
    const { onKeydown } = useMenuKeyboard({ itemCount: 2, onEscape, returnFocusTo })

    const event = keydown('Escape')
    onKeydown(event)
    expect(onEscape).toHaveBeenCalledWith(event)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)

    trigger.remove()
  })

  it('tolerates Escape without a focus target', () => {
    const onEscape = vi.fn()
    const { onKeydown } = useMenuKeyboard({ itemCount: 0, onEscape })
    expect(() => onKeydown(keydown('Escape'))).not.toThrow()
    expect(onEscape).toHaveBeenCalled()
  })

  it('exposes aria-activedescendant id and roving tabindex', () => {
    const { activeDescendantId, tabindexFor, onKeydown } = useMenuKeyboard({
      itemCount: 3,
      getItemId: (index) => `opt-${index}`,
    })
    expect(activeDescendantId.value).toBeUndefined()
    onKeydown(keydown('ArrowDown'))
    expect(activeDescendantId.value).toBe('opt-0')
    expect(tabindexFor(0)).toBe(0)
    expect(tabindexFor(1)).toBe(-1)
  })

  it('ignores keys while disabled', () => {
    const enabled = ref(false)
    const onEscape = vi.fn()
    const { activeIndex, onKeydown } = useMenuKeyboard({ itemCount: 3, enabled, onEscape })
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('Escape'))
    expect(activeIndex.value).toBe(-1)
    expect(onEscape).not.toHaveBeenCalled()

    enabled.value = true
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
  })

  it('clamps the highlight when the item list shrinks', async () => {
    const itemCount = ref(3)
    const { activeIndex, onKeydown } = useMenuKeyboard({ itemCount })
    onKeydown(keydown('End'))
    expect(activeIndex.value).toBe(2)

    itemCount.value = 1
    await nextTick()
    expect(activeIndex.value).toBe(0)

    itemCount.value = 0
    await nextTick()
    expect(activeIndex.value).toBe(-1)
  })

  it('accepts getter sources for reactive options', () => {
    const count = ref(2)
    const { activeIndex, onKeydown } = useMenuKeyboard({
      itemCount: () => count.value,
      wrap: () => false,
    })
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('ArrowDown'))
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(1)
    count.value = 3
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(2)
  })

  it('reset restores the initial highlight', () => {
    const { activeIndex, reset, onKeydown } = useMenuKeyboard({ itemCount: 3 })
    onKeydown(keydown('ArrowDown'))
    expect(activeIndex.value).toBe(0)
    reset()
    expect(activeIndex.value).toBe(-1)
  })
})
