import type { MaybeRefOrGetter } from 'vue'
import type { MotionPresetId, MotionTransitionRole } from './motionPresets'
import { computed, toValue } from 'vue'
import { getComponentDefault, useMConfig } from '../shared/config'
import { resolveMotionTransition } from './motionPresets'

export interface UseMotionTransitionOptions {
  role: MotionTransitionRole
  /** Component `transition` prop. */
  local: MaybeRefOrGetter<MotionPresetId | false | undefined>
  componentName: string
  /** Built-in default when nothing else is configured. */
  fallback: MotionPresetId
}

/**
 * Resolve Vue `<Transition :name>` from local prop → componentDefaults → global role → fallback.
 * `undefined` means disable CSS transitions (`:css="false"`).
 */
export function useMotionTransition(options: UseMotionTransitionOptions) {
  const config = useMConfig()

  const transitionName = computed(() => {
    const local = toValue(options.local)
    const componentDefault = getComponentDefault<MotionPresetId | false>(
      config.value.componentDefaults,
      options.componentName,
      'transition',
    )
    const rolePreset = config.value.motion?.transitions?.[options.role]

    return resolveMotionTransition({
      local,
      componentDefault,
      rolePreset,
      fallback: options.fallback,
    })
  })

  const transitionCss = computed(() => transitionName.value !== undefined)

  return { transitionName, transitionCss }
}
