import type { Directive, DirectiveBinding } from 'vue'
import type { MSizeInput } from '../../shared/types'
import type { LoadingMaskInstance } from './loading'
import type { LoadingBinding, LoadingEffect } from './types'
import { mountLoadingMask } from './loading'
import { isLoadingEffect } from './types'

interface DirectiveState {
  instance: LoadingMaskInstance
  mode: string
}

const states = new WeakMap<HTMLElement, DirectiveState>()

function readAttr(el: HTMLElement, ...names: string[]) {
  for (const name of names) {
    const value = el.getAttribute(name)
    if (value != null) return value
  }
  return undefined
}

function resolveEffect(value: unknown): LoadingEffect | undefined {
  return isLoadingEffect(value) ? value : undefined
}

function resolveOptions(el: HTMLElement, binding: DirectiveBinding<boolean | LoadingBinding>) {
  const value = binding.value
  const fromObject = value && typeof value === 'object' ? value : undefined
  const visible = typeof value === 'boolean'
    ? value
    : fromObject
      ? fromObject.loading !== false
      : Boolean(value)
  const fullscreen = Boolean(binding.modifiers.fullscreen || fromObject?.fullscreen)
  const body = Boolean(binding.modifiers.body || fromObject?.body) && !fullscreen
  const effect = resolveEffect(fromObject?.effect ?? readAttr(el, 'm-loading-effect'))
  const size = fromObject?.size
  const delayAttr = readAttr(el, 'm-loading-delay')
  const delay = fromObject?.delay ?? (delayAttr != null ? Number(delayAttr) : undefined)

  return {
    visible,
    text: fromObject?.text ?? readAttr(el, 'm-loading-text'),
    effect,
    background: fromObject?.background ?? readAttr(el, 'm-loading-background'),
    customClass: fromObject?.customClass ?? readAttr(el, 'm-loading-custom-class'),
    size: typeof size === 'string' ? size as MSizeInput : undefined,
    fullscreen,
    lock: Boolean(binding.modifiers.lock || fromObject?.lock),
    body,
    delay: Number.isFinite(delay) ? delay : undefined,
    spinner: fromObject?.spinner,
    mode: `${fullscreen}:${body}`,
  }
}

function sync(el: HTMLElement, binding: DirectiveBinding<boolean | LoadingBinding>) {
  const options = resolveOptions(el, binding)
  const current = states.get(el)

  if (!options.visible) {
    if (!current) return
    states.delete(el)
    current.instance.close()
    return
  }

  if (current && current.mode === options.mode) {
    current.instance.update(options)
    return
  }

  current?.instance.destroy()
  states.set(el, {
    mode: options.mode,
    instance: mountLoadingMask({
      target: el,
      text: options.text,
      effect: options.effect,
      background: options.background,
      customClass: options.customClass,
      size: options.size,
      fullscreen: options.fullscreen,
      lock: options.lock,
      body: options.body,
      delay: options.delay,
      spinner: options.spinner,
      appContext: binding.instance?.$.appContext,
    }),
  })
}

/**
 * `v-loading` directive.
 *
 * ```vue
 * <div v-loading="loading" m-loading-text="加载中" m-loading-effect="wave" />
 * <div v-loading.fullscreen.lock="loading" />
 * ```
 */
export const vLoading: Directive<HTMLElement, boolean | LoadingBinding> = {
  mounted: sync,
  updated: sync,
  unmounted(el) {
    const current = states.get(el)
    if (!current) return
    states.delete(el)
    current.instance.destroy()
  },
}
