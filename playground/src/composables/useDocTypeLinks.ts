import type { Ref } from 'vue'
import { nextTick, watch } from 'vue'
import { useDocsI18n } from '../i18n'
import { DOC_TYPE_LINKS_READY_ATTR, enhanceDocTypeLinks } from '../utils/docTypeLinks'

export function useDocTypeLinks(root: Ref<HTMLElement | null | undefined>, source: Ref<unknown>) {
  const { lang } = useDocsI18n()

  const enhance = async () => {
    await nextTick()
    await nextTick()
    const el = root.value
    if (!el) return
    el.querySelectorAll(`[${DOC_TYPE_LINKS_READY_ATTR}]`).forEach((node) => {
      node.removeAttribute(DOC_TYPE_LINKS_READY_ATTR)
    })
    enhanceDocTypeLinks(el)
  }

  watch([source, lang], () => void enhance(), { immediate: true })
}
