import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useDocsI18n } from '../i18n'

export interface DocSection {
  id: string
  label: string
  level: 2 | 3
}

const SCROLL_SPY_OFFSET = 96

export function useDocSections(
  bodyRef: Ref<HTMLElement | null>,
  docKey: Ref<string>,
  fallbackLabel?: Ref<string>,
) {
  const { t } = useDocsI18n()
  const sections = ref<DocSection[]>([])
  const activeSectionId = ref('')
  const exampleCount = ref(0)
  let scrollContainer: HTMLElement | null = null
  let scrollListener: (() => void) | null = null
  let clickLockUntil = 0

  function resolveScrollContainer() {
    return bodyRef.value?.closest('.wd-scrollbar__wrap') as HTMLElement | null
  }

  function teardownScrollSpy() {
    if (scrollContainer && scrollListener) {
      scrollContainer.removeEventListener('scroll', scrollListener, { passive: true })
    }
    scrollContainer = null
    scrollListener = null
  }

  function updateActiveSection() {
    if (Date.now() < clickLockUntil) return
    if (!sections.value.length) {
      activeSectionId.value = ''
      return
    }

    const container = scrollContainer ?? resolveScrollContainer()
    if (!container) {
      activeSectionId.value = sections.value[0]?.id ?? ''
      return
    }

    const marker = container.getBoundingClientRect().top + SCROLL_SPY_OFFSET
    let nextActive = sections.value[0]?.id ?? ''

    for (const section of sections.value) {
      const target = document.getElementById(section.id)
      if (!target) continue
      if (target.getBoundingClientRect().top <= marker) {
        nextActive = section.id
      }
    }

    activeSectionId.value = nextActive
  }

  function setupScrollSpy() {
    teardownScrollSpy()
    scrollContainer = resolveScrollContainer()
    if (!scrollContainer || !sections.value.length) return

    scrollListener = () => updateActiveSection()
    scrollContainer.addEventListener('scroll', scrollListener, { passive: true })
    updateActiveSection()
  }

  async function refreshNavigation() {
    await nextTick()
    await nextTick()

    const body = bodyRef.value
    if (!body) {
      sections.value = []
      exampleCount.value = 0
      activeSectionId.value = ''
      teardownScrollSpy()
      return
    }

    const headings = [...body.querySelectorAll<HTMLElement>('h2, h3')]
    sections.value = headings.map((heading, index) => {
      const id = `${docKey.value.toLowerCase()}-section-${index + 1}`
      heading.id = id
      return {
        id,
        label: heading.textContent?.trim()
          || fallbackLabel?.value
          || t.value.componentSection,
        level: heading.tagName === 'H3' ? 3 : 2,
      }
    })
    exampleCount.value = body.querySelectorAll('.code-preview').length
    activeSectionId.value = sections.value[0]?.id ?? ''
    await nextTick()
    setupScrollSpy()
  }

  function scrollToSection(id: string) {
    const target = document.getElementById(id)
    if (!target) return

    activeSectionId.value = id
    clickLockUntil = Date.now() + 480

    const container = scrollContainer ?? resolveScrollContainer()
    if (container) {
      const containerTop = container.getBoundingClientRect().top
      const targetTop = target.getBoundingClientRect().top
      container.scrollTo({
        top: container.scrollTop + (targetTop - containerTop) - 12,
        behavior: 'smooth',
      })
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  watch(docKey, () => refreshNavigation())
  watch(sections, () => nextTick(setupScrollSpy), { deep: true })

  onBeforeUnmount(teardownScrollSpy)

  return {
    sections,
    activeSectionId,
    exampleCount,
    refreshNavigation,
    scrollToSection,
  }
}
