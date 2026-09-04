<script setup lang="ts">
import type { FormItemProps, FormItemRule, FormValidateTrigger } from './types'
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { useWiId } from '../../shared/useWiId'
import { useWiLocale } from '../../locale'
import { WI_FORM_ERRORS_KEY, WI_FORM_KEY } from './context'
import {
  evaluateFormRule,
  normalizeFormRules,
  ruleMatchesTrigger,
  toCssSize,
} from './rules'

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
  invalid: false,
})

const form = inject(WI_FORM_KEY, null)
const formErrors = inject(WI_FORM_ERRORS_KEY, null)
const locale = useWiLocale()
const autoId = useWiId()

const labelPosition = computed(() => props.labelPosition ?? form?.value.labelPosition ?? 'top')
const labelAlign = computed(() => props.labelAlign ?? form?.value.labelAlign ?? 'left')
const labelWidth = computed(() => toCssSize(props.labelWidth ?? form?.value.labelWidth))
const fieldName = computed(() => props.name ?? props.for)
const mergedRules = computed<FormItemRule[]>(() => {
  const name = fieldName.value
  const fromForm = name ? normalizeFormRules(form?.value.rules?.[name]) : []
  return [...fromForm, ...normalizeFormRules(props.rules)]
})
const showRequireMark = computed(
  () => Boolean((form?.value.requireMark ?? true) && (props.required || mergedRules.value.some((rule) => rule.required))),
)
const internalError = computed(() => {
  const name = fieldName.value
  if (!name || !formErrors) return undefined
  return formErrors[name]
})
const displayError = computed(() => props.error ?? internalError.value)
const isInvalid = computed(() => props.invalid || Boolean(displayError.value))
const controlId = computed(() => props.for ?? `wi-form-item-${autoId}`)
const messageId = computed(() => `${controlId.value}-message`)
const requiredLabel = computed(() => locale.value.required)
const fieldValue = computed(() => {
  const name = fieldName.value
  if (!name) return undefined
  return form?.value.model?.[name]
})

const rootClass = computed(() => [
  'wi-form-item',
  `wi-form-item--label-${labelPosition.value}`,
  `wi-form-item--align-${labelAlign.value}`,
  {
    'wi-form-item--invalid': isInvalid.value,
    'wi-form-item--required': showRequireMark.value,
  },
])

const labelStyle = computed(() => {
  const style: Record<string, string> = { textAlign: labelAlign.value }
  if (labelPosition.value === 'left' && labelWidth.value) style.width = labelWidth.value
  return style
})

async function validateField(trigger: FormValidateTrigger | 'all' = 'all') {
  const value = fieldValue.value
  const formTriggers = form?.value.validateOn ?? ['submit']
  for (const rule of mergedRules.value) {
    if (!ruleMatchesTrigger(rule, trigger, formTriggers)) continue
    const message = await evaluateFormRule(rule, value, locale.value.required)
    if (message) return message
  }
  if (props.validate && ruleMatchesTrigger({}, trigger, formTriggers)) {
    const result = await props.validate(trigger)
    if (typeof result === 'string' && result.trim()) return result.trim()
    if (result === false) return locale.value.required
  }
  return undefined
}

watch(
  () => [fieldName.value, mergedRules.value, props.validate] as const,
  ([name], previous) => {
    const previousName = previous?.[0]
    if (previousName && previousName !== name) form?.value.unregisterField(previousName)
    if (!form?.value || !name) return
    form.value.registerField({
      name,
      validate: (trigger) => validateField(trigger ?? 'all'),
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  const name = fieldName.value
  if (name) form?.value.unregisterField(name)
})

function onFocusOut() {
  const name = fieldName.value
  if (name) form?.value.notifyBlur(name)
}

function onChange() {
  const name = fieldName.value
  if (name) form?.value.notifyChange(name)
}

function onInput() {
  const name = fieldName.value
  if (name) form?.value.notifyInput(name)
}
</script>

<template>
  <div :class="rootClass" @focusout="onFocusOut" @change="onChange" @input="onInput">
    <label
      v-if="label"
      class="wi-form-item__label"
      :for="controlId"
      :style="labelStyle"
    >
      <span v-if="showRequireMark" class="wi-form-item__required" :aria-label="requiredLabel">*</span>
      {{ label }}
    </label>
    <div class="wi-form-item__body">
      <div class="wi-form-item__control">
        <slot
          :id="controlId"
          :invalid="isInvalid"
          :described-by="displayError || help ? messageId : undefined"
          :error="displayError"
        />
      </div>
      <p
        v-if="displayError"
        :id="messageId"
        class="wi-form-item__error"
        role="alert"
      >
        {{ displayError }}
      </p>
      <p
        v-else-if="help"
        :id="messageId"
        class="wi-form-item__help"
      >
        {{ help }}
      </p>
    </div>
  </div>
</template>
