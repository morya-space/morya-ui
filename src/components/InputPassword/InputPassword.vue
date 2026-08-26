<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, type Component } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'
import {
  useComponentDefaults,
  useConfiguredSize,
  useConfiguredVariant,
} from '../../shared/config'
import type { WiShowPasswordOn } from '../../shared/componentDefaults'
import WiIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
import type { InputPasswordProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<InputPasswordProps>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  invalid: false,
  feedback: false,
  toggleMask: true,
  showIcon: 'eye',
  hideIcon: 'eye-off',
  clearable: undefined,
  showCount: undefined,
  fluid: undefined,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'clear'): void
}>()

const defaults = useComponentDefaults('InputPassword')
const locale = useWiLocale()
const unmasked = ref(false)
const inputElement = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id ?? `wi-password-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = useConfiguredSize('InputPassword', () => props.size)
const resolvedVariant = useConfiguredVariant('InputPassword', () => props.variant)
const resolvedFluid = computed(() => props.fluid ?? (defaults.value.fluid as boolean | undefined) ?? false)
const resolvedClearable = computed(() => props.clearable ?? (defaults.value.clearable as boolean | undefined) ?? false)
const resolvedShowCount = computed(() => props.showCount ?? (defaults.value.showCount as boolean | undefined) ?? false)
const resolvedShowPasswordOn = computed<WiShowPasswordOn>(
  () => props.showPasswordOn ?? (defaults.value.showPasswordOn as WiShowPasswordOn | undefined) ?? 'click',
)

const showIconName = computed(() => (typeof props.showIcon === 'string' ? (props.showIcon as IconName) : undefined))
const showIconComponent = computed(() =>
  typeof props.showIcon === 'string' || !props.showIcon ? undefined : (props.showIcon as Component),
)
const hideIconName = computed(() => (typeof props.hideIcon === 'string' ? (props.hideIcon as IconName) : undefined))
const hideIconComponent = computed(() =>
  typeof props.hideIcon === 'string' || !props.hideIcon ? undefined : (props.hideIcon as Component),
)

const strength = computed(() => {
  const value = props.modelValue ?? ''
  if (!value) return 'empty'
  let score = 0
  if (value.length >= 8) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  if (score <= 1) return 'weak'
  if (score <= 3) return 'medium'
  return 'strong'
})

const strengthLabel = computed(() => {
  if (strength.value === 'weak') return locale.value.passwordWeak
  if (strength.value === 'medium') return locale.value.passwordMedium
  if (strength.value === 'strong') return locale.value.passwordStrong
  return ''
})

const charCount = computed(() => (props.modelValue ?? '').length)
const countText = computed(() =>
  props.maxlength != null ? `${charCount.value} / ${props.maxlength}` : String(charCount.value),
)
const showClear = computed(() => resolvedClearable.value && Boolean(props.modelValue))
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.feedback && strength.value !== 'empty') ids.push(`${inputId.value}-feedback`)
  if (resolvedShowCount.value) ids.push(`${inputId.value}-count`)
  return ids.length ? ids.join(' ') : undefined
})

const rootClass = computed(() => [
  'wi-password',
  `wi-password--${sizeClass.value}`,
  {
    'wi-password--filled': resolvedVariant.value === 'filled',
    'wi-password--fluid': resolvedFluid.value,
    'wi-password--invalid': props.invalid,
    'wi-password--disabled': props.disabled,
    'wi-password--toggle': props.toggleMask,
    'wi-password--clearable': showClear.value,
  },
])

function updateValue(event: Event) {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function clear() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
  inputElement.value?.focus()
}

function onToggleClick(event: MouseEvent) {
  if (props.disabled) return
  if (resolvedShowPasswordOn.value === 'mousedown') {
    event.preventDefault()
    return
  }
  unmasked.value = !unmasked.value
}

let peekMouseUp: (() => void) | undefined
let peekKeyUp: ((event: KeyboardEvent) => void) | undefined

function clearPeekListeners() {
  if (peekMouseUp) {
    document.removeEventListener('mouseup', peekMouseUp)
    peekMouseUp = undefined
  }
  if (peekKeyUp) {
    document.removeEventListener('keyup', peekKeyUp)
    peekKeyUp = undefined
  }
}

function onToggleMousedown(event: MouseEvent) {
  if (props.disabled) return
  event.preventDefault()
  if (resolvedShowPasswordOn.value !== 'mousedown') return
  unmasked.value = true
  clearPeekListeners()
  peekMouseUp = () => {
    unmasked.value = false
    clearPeekListeners()
  }
  document.addEventListener('mouseup', peekMouseUp)
}

function onToggleKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (resolvedShowPasswordOn.value !== 'mousedown') return
  if (event.key !== ' ' && event.key !== 'Enter') return
  event.preventDefault()
  unmasked.value = true
  clearPeekListeners()
  peekKeyUp = (keyup: KeyboardEvent) => {
    if (keyup.key !== event.key) return
    unmasked.value = false
    clearPeekListeners()
  }
  document.addEventListener('keyup', peekKeyUp)
}

onBeforeUnmount(clearPeekListeners)
</script>

<template>
  <div class="wi-password-field" :class="{ 'wi-password-field--fluid': resolvedFluid }">
    <label v-if="label" class="wi-password-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <input
        ref="inputElement"
        v-bind="attrs"
        :id="inputId"
        class="wi-password__input"
        :type="unmasked ? 'text' : 'password'"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        autocomplete="current-password"
        @input="updateValue"
      />
      <button
        v-if="showClear"
        class="wi-password__clear"
        type="button"
        :aria-label="locale.clearInput"
        :disabled="disabled || readonly"
        @click="clear"
      >
        ×
      </button>
      <button
        v-if="toggleMask"
        class="wi-password__toggle"
        type="button"
        :aria-label="unmasked ? locale.hidePassword : locale.showPassword"
        :aria-pressed="unmasked"
        :disabled="disabled"
        @click="onToggleClick"
        @mousedown="onToggleMousedown"
        @keydown="onToggleKeydown"
      >
        <slot v-if="unmasked" name="hideIcon" :unmasked="unmasked">
          <WiIcon v-if="hideIconName" :name="hideIconName" size="sm" />
          <component :is="hideIconComponent" v-else-if="hideIconComponent" />
        </slot>
        <slot v-else name="showIcon" :unmasked="unmasked">
          <WiIcon v-if="showIconName" :name="showIconName" size="sm" />
          <component :is="showIconComponent" v-else-if="showIconComponent" />
        </slot>
      </button>
    </div>
    <div v-if="(feedback && strength !== 'empty') || resolvedShowCount" class="wi-password-field__meta">
      <span
        v-if="feedback && strength !== 'empty'"
        :id="`${inputId}-feedback`"
        class="wi-password__feedback"
        :class="`wi-password__feedback--${strength}`"
      >
        {{ formatLocale(locale.passwordStrength, { value: strengthLabel }) }}
      </span>
      <span
        v-if="resolvedShowCount"
        :id="`${inputId}-count`"
        class="wi-password-field__count"
        aria-live="polite"
      >
        {{ countText }}
      </span>
    </div>
  </div>
</template>
