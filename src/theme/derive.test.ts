import { describe, expect, it } from 'vitest'
import { camelToKebab, deriveCssVars, deriveMapTokens, tokensToCssVars } from './derive'
import { generateColorPalette } from './color'
import { compactSeed, darkSeed, lightSeed } from './seed'

describe('generateColorPalette', () => {
  it('reproduces the blue ramp for #1677ff', () => {
    expect(generateColorPalette('#1677ff')).toEqual([
      '#e6f4ff',
      '#bae0ff',
      '#91caff',
      '#69b1ff',
      '#4096ff',
      '#1677ff',
      '#0958d9',
      '#003eb3',
      '#002c8c',
      '#001d66',
    ])
  })

  it('produces a dark ramp anchored on the dark background', () => {
    const palette = generateColorPalette('#1677ff', { dark: true })
    expect(palette).toHaveLength(10)
    // The first step is mostly the dark background with a hint of the base color.
    expect(palette[0]).toMatch(/^#[0-2]/)
    expect(palette[0]).not.toBe(palette[9])
  })
})

describe('deriveCssVars — light seed', () => {
  const vars = deriveCssVars(lightSeed)

  it('reproduces the shipped brand and semantic colors', () => {
    expect(vars['--m-color-primary']).toBe('#1677ff')
    expect(vars['--m-color-primary-hover']).toBe('#4096ff')
    expect(vars['--m-color-primary-active']).toBe('#0958d9')
    expect(vars['--m-color-success']).toBe('#52c41a')
    expect(vars['--m-color-warning']).toBe('#faad14')
    expect(vars['--m-color-error']).toBe('#ff4d4f')
  })

  it('reproduces the shipped neutral surfaces, text and borders', () => {
    expect(vars['--m-color-surface']).toBe('#ffffff')
    expect(vars['--m-color-text']).toBe('rgba(0, 0, 0, 0.88)')
    expect(vars['--m-color-text-muted']).toBe('rgba(0, 0, 0, 0.45)')
    expect(vars['--m-color-text-disabled']).toBe('rgba(0, 0, 0, 0.25)')
    expect(vars['--m-color-bg-disabled']).toBe('rgba(0, 0, 0, 0.04)')
    expect(vars['--m-color-border']).toBe('#d9d9d9')
    expect(vars['--m-color-split']).toBe('#f0f0f0')
    expect(vars['--m-color-bg-layout']).toBe('#f5f5f5')
  })

  it('reproduces the shipped sizing scale', () => {
    expect(vars['--m-control-height-small']).toBe('24px')
    expect(vars['--m-control-height-medium']).toBe('32px')
    expect(vars['--m-control-height-large']).toBe('40px')
    expect(vars['--m-size']).toBe('16px')
    expect(vars['--m-size-xxs']).toBe('4px')
    expect(vars['--m-size-xxl']).toBe('48px')
  })

  it('reproduces the shipped radius and spacing scale', () => {
    expect(vars['--m-border-radius']).toBe('6px')
    expect(vars['--m-border-radius-lg']).toBe('8px')
    expect(vars['--m-radius-control']).toBe('6px')
    expect(vars['--m-space-1']).toBe('4px')
    expect(vars['--m-space-4']).toBe('16px')
    expect(vars['--m-space-6']).toBe('24px')
    expect(vars['--m-space-8']).toBe('32px')
  })

  it('reproduces the shipped typography and motion scale', () => {
    expect(vars['--m-font-size']).toBe('14px')
    expect(vars['--m-font-size-md']).toBe('14px')
    expect(vars['--m-motion-fast']).toBe('150ms')
    expect(vars['--m-motion-normal']).toBe('250ms')
    expect(vars['--m-motion-ease']).toBe('cubic-bezier(0.215, 0.61, 0.355, 1)')
  })

  it('does not clobber legacy font-size tokens with different values', () => {
    expect(vars['--m-font-size-sm']).toBeUndefined()
    expect(vars['--m-font-size-lg']).toBeUndefined()
  })
  it('derives the soft control-outline focus glow', () => {
    expect(vars['--m-color-control-outline']).toBe('rgba(5, 145, 255, 0.1)')
    expect(vars['--m-color-control-outline-danger']).toBe('rgba(255, 38, 5, 0.06)')
    expect(vars['--m-color-control-outline-warning']).toBe('rgba(255, 215, 5, 0.1)')
    expect(vars['--m-focus-outline-width']).toBe('2px')
    expect(vars['--m-focus-shadow']).toBe('0 0 0 2px rgba(5, 145, 255, 0.1)')
  })
})

describe('deriveCssVars — dark seed', () => {
  const vars = deriveCssVars(darkSeed)

  it('reproduces the shipped dark surfaces and borders', () => {
    expect(vars['--m-color-surface']).toBe('#141414')
    expect(vars['--m-color-border']).toBe('#424242')
    expect(vars['--m-color-split']).toBe('#303030')
    expect(vars['--m-color-bg-layout']).toBe('#000000')
    expect(vars['--m-color-text']).toBe('rgba(255, 255, 255, 0.85)')
    expect(vars['--m-color-text-muted']).toBe('rgba(255, 255, 255, 0.45)')
  })

  it('derives the dark soft control-outline focus glow', () => {
    expect(vars['--m-color-control-outline']).toBe('rgba(23, 117, 249, 0.31)')
    expect(vars['--m-color-control-outline-danger']).toBe('rgba(249, 75, 78, 0.31)')
    expect(vars['--m-color-control-outline-warning']).toBe('rgba(250, 173, 20, 0.3)')
    expect(vars['--m-focus-shadow']).toBe('0 0 0 2px rgba(23, 117, 249, 0.31)')
  })
})

describe('deriveCssVars — seeds drive derivation', () => {
  it('propagates a custom brand color to every derived token', () => {
    const custom = deriveCssVars({ ...lightSeed, colorPrimary: '#0b6e4f' })
    const fallback = deriveCssVars(lightSeed)

    expect(custom['--m-color-primary']).toBe('#0b6e4f')
    expect(custom['--m-color-primary-hover']).not.toBe(fallback['--m-color-primary-hover'])
    expect(custom['--m-color-primary-active']).not.toBe(fallback['--m-color-primary-active'])
    expect(custom['--m-color-primary-bg']).not.toBe(fallback['--m-color-primary-bg'])
    expect(custom['--m-color-primary-border']).not.toBe(fallback['--m-color-primary-border'])
    expect(custom['--m-color-focus-ring']).toBe('#0b6e4f')
  })

  it('propagates controlHeight to the whole control scale', () => {
    const custom = deriveCssVars({ ...lightSeed, controlHeight: 40 })
    expect(custom['--m-control-height-medium']).toBe('40px')
    expect(custom['--m-control-height-small']).toBe('30px')
    expect(custom['--m-control-height-large']).toBe('50px')
  })

  it('propagates borderRadius and fontSize to their scales', () => {
    const custom = deriveCssVars({ ...lightSeed, borderRadius: 10, fontSize: 16 })
    expect(custom['--m-border-radius']).toBe('10px')
    expect(custom['--m-border-radius-lg']).toBe('12px')
    expect(custom['--m-radius-control']).toBe('10px')
    expect(custom['--m-font-size']).toBe('16px')
    expect(custom['--m-font-size-md']).toBe('16px')
  })

  it('uses the compact seed for a tighter sizing profile', () => {
    const compact = deriveCssVars(compactSeed)
    expect(compact['--m-control-height-medium']).toBe('28px')
    expect(compact['--m-size-xxs']).toBe('2px')
  })
})

describe('tokensToCssVars', () => {
  it('kebab-cases camelCase token names', () => {
    expect(camelToKebab('colorPrimaryBgHover')).toBe('color-primary-bg-hover')
    expect(camelToKebab('colorText')).toBe('color-text')
    expect(tokensToCssVars({ colorPrimary: '#000' })['--m-color-primary']).toBe('#000')
  })
})

describe('deriveMapTokens', () => {
  it('exposes the token map even for names skipped from CSS output', () => {
    const tokens = deriveMapTokens(lightSeed)
    expect(tokens.fontSizeSM).toBe('12px')
    expect(tokens.fontSizeLG).toBe('16px')
    // ...while the legacy CSS variable stays owned by styles.css.
    expect(tokensToCssVars(tokens)['--m-font-size-sm']).toBeUndefined()
  })

  it('includes heading and line-height tokens', () => {
    const tokens = deriveMapTokens(lightSeed)
    expect(tokens.fontSizeHeading1).toBe('38px')
    expect(tokens.fontSizeHeading5).toBe('16px')
    expect(tokens.lineHeight).toBe('1.5714')
  })
})
