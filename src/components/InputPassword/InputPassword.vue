<script setup lang="ts">
import { computed, ref, useAttrs, type Component } from 'vue'
import { formatLocale, useWiLocale } from '../../locale'
import { useWiConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
import type { InputPasswordProps } from './types'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const props = withDefaults(defineProps<InputPasswordProps>(), {
  modelValue: '',
  disabled: false,
  invalid: false,
  fluid: false,
  feedback: false,
  toggleMask: true,
  showIcon: 'eye',
  hideIcon: 'eye-off',
})
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()

const config = useWiConfig()
const locale = useWiLocale()
const unmasked = ref(false)
const inputId = computed(() => props.id ?? `wi-password-${Math.random().toString(36).slice(2, 8)}`)
const sizeClass = computed(() => resolveSizeClass(props.size ?? config.value.size))

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

const rootClass = computed(() => [
  'wi-password',
  `wi-password--${sizeClass.value}`,
  {
    'wi-password--fluid': props.fluid,
    'wi-password--invalid': props.invalid,
    'wi-password--disabled': props.disabled,
    'wi-password--toggle': props.toggleMask,
  },
])

function updateValue(event: Event) {
  if (props.disabled) return
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="wi-password-field" :class="{ 'wi-password-field--fluid': fluid }">
    <label v-if="label" class="wi-password-field__label" :for="inputId">{{ label }}</label>
    <div :class="rootClass">
      <input
        v-bind="attrs"
        :id="inputId"
        class="wi-password__input"
        :type="unmasked ? 'text' : 'password'"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="invalid || undefined"
        autocomplete="current-password"
        @input="updateValue"
      />
      <button
        v-if="toggleMask"
        class="wi-password__toggle"
        type="button"
        :aria-label="unmasked ? locale.hidePassword : locale.showPassword"
        :aria-pressed="unmasked"
        :disabled="disabled"
        @click="unmasked = !unmasked"
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
    <span
      v-if="feedback && strength !== 'empty'"
      class="wi-password__feedback"
      :class="`wi-password__feedback--${strength}`"
    >
      {{ formatLocale(locale.passwordStrength, { value: strengthLabel }) }}
    </span>
  </div>
</template>
