import { message, toast } from '@well-insight/ui'

/**
 * Admin action feedback — follows `docs/feedback-message-vs-toast.md`.
 * Default to Message; Toast only when detail is provided.
 */
export function useActionFeedback() {
  function ok(text: string) {
    message.success(text)
  }

  function info(text: string) {
    message.info(text)
  }

  function warn(text: string) {
    message.warn(text)
  }

  function fail(text: string) {
    message.error(text)
  }

  function notify(
    summary: string,
    detail?: string,
    severity: 'success' | 'info' | 'warn' | 'error' = 'success',
  ) {
    if (detail) {
      toast[severity]({ summary, detail })
      return
    }
    message[severity](summary)
  }

  return { ok, info, warn, fail, notify }
}
