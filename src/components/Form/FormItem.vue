<script setup lang="ts">
import type { MFormFieldValidation } from './context'
import type { NamePathKey } from './paths'
import type { FormItemProps, FormItemRule, FormValidateTrigger } from './types'
import { computed, inject, onBeforeUnmount, useAttrs, watch } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMId } from '../../shared/useMId'
import { M_FORM_ERRORS_KEY, M_FORM_KEY, M_FORM_WARNINGS_KEY } from './context'
import { getPathValue, pathKey, toPath } from './paths'
import {
  evaluateFormRule,
  normalizeFormRules,
  ruleMatchesTrigger,
  toCssSize,
} from './rules'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
  invalid: false,
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const form = inject(M_FORM_KEY, null)
const formErrors = inject(M_FORM_ERRORS_KEY, null)
const formWarnings = inject(M_FORM_WARNINGS_KEY, null)
const locale = useMLocale()
const autoId = useMId()

const labelPosition = computed(() => props.labelPosition ?? form?.value.labelPosition ?? 'top')
const labelAlign = computed(() => props.labelAlign ?? form?.value.labelAlign ?? 'left')
const labelWidth = computed(() => toCssSize(props.labelWidth ?? form?.value.labelWidth))

/** Explicit path for the field; empty when the item is not bound to a model value. */
const fieldPath = computed<NamePathKey[]>(() => {
  if (props.name != null && props.name !== '') return toPath(props.name)
  return props.for ? [props.for] : []
})
/** Canonical registration / error key. */
const fieldKey = computed(() => pathKey(fieldPath.value))
const fieldName = computed(() => fieldKey.value)

const mergedRules = computed<FormItemRule[]>(() => {
  const rules = form?.value.rules
  const keys = [fieldKey.value, typeof props.name === 'string' ? props.name : undefined]
    .filter((key): key is string => Boolean(key))

  const fromForm = keys.flatMap((key) => normalizeFormRules(rules?.[key]))
  return [...fromForm, ...normalizeFormRules(props.rules)]
})
const showRequireMark = computed(
  () => Boolean((form?.value.requireMark ?? true) && (props.required || mergedRules.value.some((rule) => rule.required))),
)
const internalError = computed(() => {
  const key = fieldKey.value
  if (!key || !formErrors) return undefined
  return formErrors[key]
})
const internalWarning = computed(() => {
  const key = fieldKey.value
  if (!key || !formWarnings) return undefined
  return formWarnings[key]
})
const displayError = computed(() => props.error ?? internalError.value)
const displayWarning = computed(() => (displayError.value ? undefined : internalWarning.value))
const isInvalid = computed(() => props.invalid || Boolean(displayError.value))
const controlId = computed(() => props.for ?? `m-form-item-${autoId}`)
const messageId = computed(() => `${controlId.value}-message`)
const requiredLabel = computed(() => locale.value.required)
const fieldValue = computed(() => {
  if (fieldPath.value.length === 0) return undefined
  return getPathValue(form?.value.model, fieldPath.value)
})

const ruleMessages = computed(() => ({
  required: locale.value.required,
  invalidValue: locale.value.invalidValue,
  invalidEmail: locale.value.invalidEmail,
  invalidUrl: locale.value.invalidUrl,
  invalidDate: locale.value.invalidDate,
}))

const rootClass = computed(() => [
  'm-form-item',
  `m-form-item--label-${labelPosition.value}`,
  `m-form-item--align-${labelAlign.value}`,
  {
    'm-form-item--invalid': isInvalid.value,
    'm-form-item--warning': Boolean(displayWarning.value),
    'm-form-item--required': showRequireMark.value,
  },
])

const labelStyle = computed(() => {
  const style: Record<string, string> = { textAlign: labelAlign.value }
  if (labelPosition.value === 'left' && labelWidth.value) style.width = labelWidth.value
  return style
})

async function validateField(trigger: FormValidateTrigger | 'all' = 'all'): Promise<MFormFieldValidation> {
  const value = fieldValue.value
  const formTriggers = form?.value.validateOn ?? ['submit']

  let warning: string | undefined

  for (const rule of mergedRules.value) {
    if (!ruleMatchesTrigger(rule, trigger, formTriggers)) continue
    const message = await evaluateFormRule(rule, value, ruleMessages.value)
    if (!message) continue
    if (rule.warningOnly) {
      warning ??= message
      continue
    }
    return { message }
  }

  if (props.validate && ruleMatchesTrigger({}, trigger, formTriggers)) {
    const result = await props.validate(trigger)
    const message = typeof result === 'string' && result.trim()
      ? result.trim()
      : result === false ? locale.value.required : undefined
    if (message) return { message }
  }

  return warning ? { message: warning, warning: true } : {}
}

watch(
  () => [fieldKey.value, fieldPath.value, mergedRules.value, props.validate, props.dependencies] as const,
  (_next, previous) => {
    const previousKey = previous?.[0]
    if (previousKey && previousKey !== fieldKey.value) form?.value.unregisterField(previousKey)
    if (!form?.value || !fieldKey.value) return
    form.value.registerField({
      key: fieldKey.value,
      name: fieldPath.value,
      dependencies: props.dependencies,
      validate: trigger => validateField(trigger ?? 'all'),
    })
  },
  { immediate: true },
)

// Re-validate as soon as any declared dependency value changes.
watch(
  () => (props.dependencies ?? []).map(dep => getPathValue(form?.value.model, toPath(dep))),
  () => {
    if (!props.dependencies?.length || !fieldKey.value) return
    form?.value.revalidate(fieldKey.value)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  const key = fieldKey.value
  if (key) form?.value.unregisterField(key)
})

function onFocusOut() {
  const key = fieldKey.value
  if (key) form?.value.notifyBlur(key)
}

function onChange() {
  const key = fieldKey.value
  if (key) form?.value.notifyChange(key)
}

function onInput() {
  const key = fieldKey.value
  if (key) form?.value.notifyInput(key)
}
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
    :data-m-field="fieldName || undefined"
    @focusout="onFocusOut"
    @change="onChange"
    @input="onInput"
  >
    <label
      v-if="label"
      class="m-form-item__label"
      :for="controlId"
      :style="labelStyle"
    >
      <span v-if="showRequireMark" class="m-form-item__required" :aria-label="requiredLabel">*</span>
      {{ label }}
    </label>
    <div class="m-form-item__body">
      <div class="m-form-item__control">
        <slot
          :id="controlId"
          :invalid="isInvalid"
          :described-by="displayError || displayWarning || help ? messageId : undefined"
          :error="displayError"
        />
      </div>
      <p
        v-if="displayError"
        :id="messageId"
        class="m-form-item__error"
        role="alert"
      >
        {{ displayError }}
      </p>
      <p
        v-else-if="displayWarning"
        :id="messageId"
        class="m-form-item__warning"
        role="status"
      >
        {{ displayWarning }}
      </p>
      <p
        v-else-if="help"
        :id="messageId"
        class="m-form-item__help"
      >
        {{ help }}
      </p>
    </div>
  </div>
</template>
