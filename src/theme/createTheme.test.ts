import { describe, expect, it } from 'vitest'
import { createTheme, resolveThemeCssVars, themeCssVarNames } from './createTheme'

describe('createTheme', () => {
  it('defaults to the shipped light palette', () => {
    const theme = createTheme()
    expect(theme.cssVars['--m-color-primary']).toBe('#1677ff')
    expect(theme.cssVars['--m-color-surface']).toBe('#ffffff')
    expect(theme.getToken('colorPrimary')).toBe('#1677ff')
  })

  it('applies a brand seed to every derived token', () => {
    const theme = createTheme({ seed: { colorPrimary: '#0b6e4f' } })
    expect(theme.cssVars['--m-color-primary']).toBe('#0b6e4f')
    expect(theme.cssVars['--m-color-focus-ring']).toBe('#0b6e4f')
    expect(theme.cssVars['--m-color-primary-hover']).not.toBe(theme.cssVars['--m-color-primary'])
    expect(theme.cssVars['--m-color-primary-bg']).not.toBe(
      createTheme().cssVars['--m-color-primary-bg'],
    )
  })

  it('derives dark neutrals from the dark algorithm', () => {
    const theme = createTheme({ algorithm: 'dark' })
    expect(theme.cssVars['--m-color-surface']).toBe('#141414')
    expect(theme.cssVars['--m-color-border']).toBe('#424242')
    expect(theme.cssVars['--m-color-text']).toBe('rgba(255, 255, 255, 0.85)')
  })

  it('composes multiple algorithms without one overwriting the other', () => {
    const theme = createTheme({ algorithm: ['dark', 'compact'] })
    // compact tightening survives...
    expect(theme.cssVars['--m-control-height-medium']).toBe('28px')
    // ...while the dark neutrals are still in effect.
    expect(theme.cssVars['--m-color-surface']).toBe('#141414')
    expect(theme.cssVars['--m-color-text']).toBe('rgba(255, 255, 255, 0.85)')
  })

  it('lets an explicit seed win over the algorithm', () => {
    const theme = createTheme({ algorithm: 'dark', seed: { colorBgBase: '#101820' } })
    // Layout background sits directly on the base; containers are derived from it.
    expect(theme.cssVars['--m-color-bg-layout']).toBe('#101820')
    expect(theme.cssVars['--m-color-surface']).not.toBe('#141414')
    expect(theme.seed.colorBgBase).toBe('#101820')
  })
})

describe('createTheme — component token overrides', () => {
  it('scopes overrides to the component root class', () => {
    const theme = createTheme({
      components: {
        Button: { colorPrimary: '#0b6e4f', '--m-button-font-weight': 600 },
      },
    })

    expect(theme.cssText).toContain('.m-button {')
    expect(theme.cssText).toContain('--m-color-primary: #0b6e4f;')
    // Raw custom properties pass through untouched.
    expect(theme.cssText).toContain('--m-button-font-weight: 600;')
  })

  it('accepts a custom selector resolver', () => {
    const theme = createTheme({
      components: { Table: { colorBorder: '#000' } },
      selector: component => `[data-theme] .m-${component.toLowerCase()}`,
    })
    expect(theme.cssText).toContain('[data-theme] .m-table {')
  })

  it('normalizes prefixed component names', () => {
    const theme = createTheme({ components: { MTable: { colorBorder: '#000' } } })
    expect(theme.cssText).toContain('.m-table {')
  })
})

describe('createTheme — DOM application', () => {
  it('writes and removes variables on a scoped element', () => {
    const el = document.createElement('div')
    const theme = createTheme({ seed: { colorPrimary: '#0b6e4f' } })

    theme.apply(el)
    expect(el.style.getPropertyValue('--m-color-primary')).toBe('#0b6e4f')

    theme.remove(el)
    expect(el.style.getPropertyValue('--m-color-primary')).toBe('')
  })

  it('injects and disposes a stylesheet', () => {
    const theme = createTheme({ seed: { colorPrimary: '#0b6e4f' } })
    const dispose = theme.inject(document)

    const style = document.getElementById('m-theme-vars')
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('--m-color-primary: #0b6e4f;')

    dispose()
    expect(document.getElementById('m-theme-vars')).toBeNull()
  })

  it('updates the same stylesheet instead of appending duplicates', () => {
    const first = createTheme({ seed: { colorPrimary: '#111111' } })
    const second = createTheme({ seed: { colorPrimary: '#222222' } })

    const disposeFirst = first.inject(document)
    const disposeSecond = second.inject(document)

    expect(document.querySelectorAll('#m-theme-vars')).toHaveLength(1)
    expect(document.getElementById('m-theme-vars')?.textContent).toContain('#222222')

    disposeSecond()
    disposeFirst()
  })
})

describe('theme helpers', () => {
  it('resolveThemeCssVars derives without touching the DOM', () => {
    const vars = resolveThemeCssVars({ seed: { controlHeight: 40 } })
    expect(vars['--m-control-height-medium']).toBe('40px')
  })

  it('themeCssVarNames lists the variables a theme owns', () => {
    const names = themeCssVarNames()
    expect(names).toContain('--m-color-primary')
    expect(names.length).toBeGreaterThan(50)
  })
})
