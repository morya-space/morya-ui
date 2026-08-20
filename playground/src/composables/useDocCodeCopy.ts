import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'
import { useDocsI18n } from '../i18n'
import { copyText } from '../utils/copyText'

const READY = 'data-wi-copy-ready'

function extractCode(pre: HTMLElement) {
  return (pre.querySelector('code') ?? pre).textContent ?? ''
}

function mountCopyButton(
  pre: HTMLElement,
  labels: { copy: string; copied: string; copyCode: string },
) {
  if (pre.getAttribute(READY) === '1') return () => undefined
  if (pre.closest('.code-preview')) return () => undefined

  const parent = pre.parentElement
  if (!parent) return () => undefined

  let wrapper: HTMLElement
  if (parent.classList.contains('wi-code-block')) {
    wrapper = parent
  } else {
    wrapper = document.createElement('div')
    wrapper.className = 'wi-code-block'
    parent.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)
  }

  let button = wrapper.querySelector<HTMLButtonElement>('.wi-code-block__copy')
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = 'wi-code-block__copy'
    wrapper.appendChild(button)
  }

  let resetTimer = 0
  const setLabel = (copied: boolean) => {
    button!.textContent = copied ? labels.copied : labels.copy
    button!.dataset.copied = copied ? 'true' : 'false'
    button!.setAttribute('aria-label', labels.copyCode)
  }
  setLabel(false)

  const onClick = async (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const ok = await copyText(extractCode(pre))
    if (!ok) return
    setLabel(true)
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => setLabel(false), 1600)
  }

  button.addEventListener('click', onClick)
  pre.setAttribute(READY, '1')

  return () => {
    window.clearTimeout(resetTimer)
    button?.removeEventListener('click', onClick)
    pre.removeAttribute(READY)
  }
}

export function useDocCodeCopy(root: Ref<HTMLElement | null | undefined>, source: Ref<unknown>) {
  const { lang, t } = useDocsI18n()
  const cleanups: Array<() => void> = []

  const clear = () => {
    while (cleanups.length) cleanups.pop()?.()
  }

  const enhance = async () => {
    clear()
    await nextTick()
    await nextTick()
    const el = root.value
    if (!el) return
    const labels = { copy: t.value.copy, copied: t.value.copied, copyCode: t.value.copyCode }
    el.querySelectorAll('pre').forEach((pre) => {
      cleanups.push(mountCopyButton(pre as HTMLElement, labels))
    })
  }

  watch([source, lang], () => void enhance(), { immediate: true })
  onBeforeUnmount(clear)
}
