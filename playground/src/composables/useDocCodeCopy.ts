import type {Ref} from 'vue';
import { nextTick, onBeforeUnmount,  watch } from 'vue'
import { useDocsI18n } from '../i18n'
import { copyText } from '../utils/copyText'

const READY = 'data-m-copy-ready'

const COPY_ICON =
  '<svg viewBox="-3.2 -2.7 29.41 29.41" aria-hidden="true" focusable="false"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"/></svg>'
const CHECK_ICON =
  '<svg viewBox="1.65 1.74 21.11 21.11" aria-hidden="true" focusable="false"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"/></svg>'

function extractCode(pre: HTMLElement) {
  return (pre.querySelector('code') ?? pre).textContent ?? ''
}

/**
 * shiki 在 playground/vite.config.ts 的 highlightCode 中通过
 * `data-language` 暴露在 <pre> 上；兜底支持 markdown-it 默认的
 * `language-xxx` class（出现在 <pre> 或 <code>）。
 */
function extractLanguage(pre: HTMLElement) {
  const fromDataset = pre.dataset.language?.trim()
  if (fromDataset && fromDataset !== 'text') return fromDataset
  const code = pre.querySelector('code')
  const fromCode = code?.className.match(/language-([\w-]+)/)?.[1]
  if (fromCode) return fromCode
  const fromPre = pre.className.match(/language-([\w-]+)/)?.[1]
  return fromPre ?? ''
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
  if (parent.classList.contains('m-code-block')) {
    wrapper = parent
  } else {
    wrapper = document.createElement('div')
    wrapper.className = 'm-code-block'
    parent.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)
  }

  const language = extractLanguage(pre)
  if (language) wrapper.dataset.language = language

  let langTag = wrapper.querySelector<HTMLElement>('.m-code-block__lang')
  if (language) {
    if (!langTag) {
      langTag = document.createElement('span')
      langTag.className = 'm-code-block__lang'
      langTag.setAttribute('aria-hidden', 'true')
      wrapper.appendChild(langTag)
    }
    langTag.textContent = language
  } else {
    langTag?.remove()
  }

  let button = wrapper.querySelector<HTMLButtonElement>('.m-code-block__copy')
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = 'm-code-block__copy'
    wrapper.appendChild(button)
  }

  let resetTimer = 0
  const setLabel = (copied: boolean) => {
    const icon = copied ? CHECK_ICON : COPY_ICON
    const text = copied ? labels.copied : labels.copy
    button!.innerHTML = `${icon}<span>${text}</span>`
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
    resetTimer = window.setTimeout(setLabel, 1600, false)
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
