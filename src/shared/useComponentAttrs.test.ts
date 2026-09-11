import { describe, expect, it } from 'vitest'
import {
  mergeClasses,
  mergePtPart,
  mergeStyles,
  splitHybridFieldAttrs,
  splitRootControlAttrs,
  useControlRootParts,
  useFieldParts,
  useRootParts,
} from './useComponentAttrs'

describe('splitHybridFieldAttrs', () => {
  it('routes fallthrough attrs to root except control events', () => {
    expect(
      splitHybridFieldAttrs({
        class: 'user-field',
        style: 'width: 12rem',
        'data-testid': 'email',
        title: 'Email field',
        tabindex: '0',
        placeholder: 'fallback',
        name: 'email',
      }),
    ).toEqual({
      rootPart: {
        class: 'user-field',
        style: 'width: 12rem',
        'data-testid': 'email',
        title: 'Email field',
        tabindex: '0',
        placeholder: 'fallback',
        name: 'email',
      },
      controlPart: {},
    })
  })

  it('routes event listeners to control', () => {
    const onKeydown = () => undefined
    const { rootPart, controlPart } = splitHybridFieldAttrs({
      class: 'field',
      onKeydown,
    })
    expect(rootPart).toEqual({ class: 'field' })
    expect(controlPart).toEqual({ onKeydown })
  })
})

describe('splitRootControlAttrs', () => {
  it('keeps backward-compatible shape', () => {
    expect(
      splitRootControlAttrs({
        class: 'user-field',
        style: 'width: 12rem',
        'data-testid': 'email',
        onFocus: () => undefined,
      }),
    ).toEqual({
      rootClass: 'user-field',
      rootStyle: 'width: 12rem',
      controlAttrs: { onFocus: expect.any(Function) },
    })
  })
})

describe('mergePtPart', () => {
  it('merges class and style while preserving other keys', () => {
    expect(
      mergePtPart(
        { class: 'a', placeholder: 'one' },
        { class: 'b', style: { color: 'red' }, name: 'email' },
      ),
    ).toEqual({
      class: ['a', 'b'],
      style: { color: 'red' },
      placeholder: 'one',
      name: 'email',
    })
  })
})

describe('mergeClasses', () => {
  it('flattens nested arrays', () => {
    expect(mergeClasses('a', ['b', { c: true }])).toEqual(['a', 'b', { c: true }])
  })
})

describe('mergeStyles', () => {
  it('merges style objects with later keys winning', () => {
    expect(mergeStyles({ width: '1rem' }, { width: '2rem', color: 'red' })).toEqual({
      width: '2rem',
      color: 'red',
    })
  })
})

describe('useFieldParts', () => {
  it('routes fallthrough to root and events to control', () => {
    const onKeydown = () => undefined
    const { rootAttrs, controlAttrs } = useFieldParts({
      class: 'field',
      style: 'width: 10rem',
      'data-testid': 'name',
      title: 'Name',
      onKeydown,
    })

    expect(rootAttrs.value).toEqual({
      class: 'field',
      style: 'width: 10rem',
      'data-testid': 'name',
      title: 'Name',
    })
    expect(controlAttrs.value).toEqual({ onKeydown })
  })

  it('merges pt parts onto root and input', () => {
    const { rootAttrs, controlAttrs } = useFieldParts(
      { class: 'field', onFocus: () => undefined },
      {
        root: { 'data-testid': 'root' },
        input: { class: 'mono', autocomplete: 'name' },
      },
    )

    expect(rootAttrs.value).toEqual({ class: 'field', 'data-testid': 'root' })
    expect(controlAttrs.value).toEqual({
      onFocus: expect.any(Function),
      class: 'mono',
      autocomplete: 'name',
    })
  })
})

describe('useControlRootParts', () => {
  it('routes class to root label and events to input', () => {
    const onChange = () => undefined
    const { rootAttrs, controlAttrs } = useControlRootParts({
      class: 'choice',
      onChange,
    })

    expect(rootAttrs.value).toEqual({ class: 'choice' })
    expect(controlAttrs.value).toEqual({ onChange })
  })
})

describe('useRootParts', () => {
  it('keeps all fallthrough attrs on root', () => {
    const { rootAttrs } = useRootParts({
      class: 'label',
      style: 'font-weight: 600',
      'data-testid': 'label',
    })

    expect(rootAttrs.value).toEqual({
      class: 'label',
      style: 'font-weight: 600',
      'data-testid': 'label',
    })
  })
})
