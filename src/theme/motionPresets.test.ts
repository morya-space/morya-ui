import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearCustomMotionPresets,
  listMotionPresets,
  registerMotionPreset,
  resolveMotionPreset,
  resolveMotionTransition,
  unregisterMotionPreset,
} from './motionPresets'

describe('motionPresets', () => {
  beforeEach(() => {
    clearCustomMotionPresets()
  })

  it('resolves built-in presets to transition names', () => {
    expect(resolveMotionPreset('fade').name).toBe('m-fade')
    expect(resolveMotionPreset('scale-fade').name).toBe('m-scale-fade')
    expect(resolveMotionPreset('zoom').name).toBe('m-zoom')
    expect(resolveMotionPreset('dialog').name).toBe('m-dialog')
    expect(resolveMotionPreset('drawer').name).toBe('m-drawer')
    expect(resolveMotionPreset('slide-up').name).toBe('m-slide-up')
  })

  it('registers and unregisters custom presets', () => {
    registerMotionPreset('brand', { name: 'm-brand' })
    expect(resolveMotionPreset('brand').name).toBe('m-brand')
    expect(listMotionPresets()).toContain('brand')

    unregisterMotionPreset('brand')
    expect(resolveMotionPreset('brand').name).toBe('m-brand') // falls back to m-${id}
  })

  it('maps unknown ids to m-prefixed CSS names', () => {
    expect(resolveMotionPreset('custom-in').name).toBe('m-custom-in')
    expect(resolveMotionPreset('m-already').name).toBe('m-already')
  })

  it('resolveMotionTransition follows local > componentDefault > role > fallback', () => {
    expect(
      resolveMotionTransition({
        local: 'fade',
        componentDefault: 'zoom',
        rolePreset: 'slide-up',
        fallback: 'scale-fade',
      }),
    ).toBe('m-fade')

    expect(
      resolveMotionTransition({
        componentDefault: 'zoom',
        rolePreset: 'slide-up',
        fallback: 'scale-fade',
      }),
    ).toBe('m-zoom')

    expect(
      resolveMotionTransition({
        rolePreset: 'slide-up',
        fallback: 'scale-fade',
      }),
    ).toBe('m-slide-up')

    expect(resolveMotionTransition({ fallback: 'scale-fade' })).toBe('m-scale-fade')
  })

  it('disables transition for false and none', () => {
    expect(resolveMotionTransition({ local: false, fallback: 'fade' })).toBeUndefined()
    expect(resolveMotionTransition({ local: 'none', fallback: 'fade' })).toBeUndefined()
    expect(
      resolveMotionTransition({ componentDefault: false, fallback: 'fade' }),
    ).toBeUndefined()
  })

  it('rejects invalid registerMotionPreset calls', () => {
    expect(() => registerMotionPreset('', { name: 'm-x' })).toThrow()
    expect(() => registerMotionPreset('x', { name: '' })).toThrow()
  })
})
