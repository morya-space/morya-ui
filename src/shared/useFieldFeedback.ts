import { computed } from 'vue'

export interface FieldFeedbackProps {
  invalid?: boolean
  errorMessage?: string
  helpText?: string
}

/** Shared invalid / help / error copy for form field wrappers. */
export function useFieldFeedback(props: FieldFeedbackProps) {
  const isInvalid = computed(() => props.invalid || Boolean(props.errorMessage))
  const feedbackText = computed(() => props.errorMessage || props.helpText)
  const feedbackIsError = computed(
    () => Boolean(props.errorMessage) || (isInvalid.value && Boolean(props.helpText)),
  )
  return { isInvalid, feedbackText, feedbackIsError }
}
