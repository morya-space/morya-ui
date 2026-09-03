import { describe, expect, it } from 'vitest'
import { useFieldFeedback } from './useFieldFeedback'

describe('useFieldFeedback', () => {
  it('treats errorMessage as invalid feedback', () => {
    const { isInvalid, feedbackText, feedbackIsError } = useFieldFeedback({
      errorMessage: 'Required',
    })
    expect(isInvalid.value).toBe(true)
    expect(feedbackText.value).toBe('Required')
    expect(feedbackIsError.value).toBe(true)
  })

  it('shows helpText when no errorMessage', () => {
    const { feedbackText, feedbackIsError } = useFieldFeedback({
      helpText: 'Optional hint',
    })
    expect(feedbackText.value).toBe('Optional hint')
    expect(feedbackIsError.value).toBe(false)
  })
})
