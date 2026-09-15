import type {Ref} from 'vue';
import { computed, ref  } from 'vue'

export interface UseControllableOptions<T> {
  /** Current controlled value; `undefined` means uncontrolled. */
  controlled: () => T | undefined
  defaultValue: T
}

/**
 * Controlled / uncontrolled state helper.
 * When `controlled()` returns `undefined`, reads and writes the internal ref.
 */
export function useControllable<T>(
  options: UseControllableOptions<T>,
  onUpdate: (value: T) => void,
) {
  const internal = ref(options.defaultValue) as Ref<T>
  const value = computed(() => {
    const controlled = options.controlled()
    return controlled !== undefined ? controlled : internal.value
  })

  function setValue(next: T) {
    if (options.controlled() === undefined) {
      internal.value = next
    }
    onUpdate(next)
  }

  return { value, setValue }
}
