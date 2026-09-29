<script setup lang="ts">
import type { AnchorContainer, AnchorProps } from './types'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { anchorContextKey } from './anchorContext'
import {
  extractHashId,
  getOffsetTop,
  getScrollTop,
  resolveScrollTarget,
  scrollContainerTo,
} from './anchorUtils'
import AnchorItems from './AnchorItems.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AnchorProps>(), {
  direction: 'vertical',
  affix: true,
  bounds: undefined,
  bound: undefined,
  offsetTop: 0,
  replace: false,
})

const emit = defineEmits<{
  change: [activeLink: string]
  click: [event: MouseEvent, link: { href: string; title?: unknown }]
}>()

const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const resolvedBounds = computed(() => props.bounds ?? props.bound ?? 5)

const links = ref<string[]>([])
const activeLink = ref<string | null>(null)
const linkTargetOffsets = ref<Record<string, number>>({})
const wrapperRef = ref<HTMLElement | null>(null)
const inkRef = ref<HTMLElement | null>(null)
const animating = ref(false)

function defaultContainer(): AnchorContainer {
  return typeof window !== 'undefined' ? window : (null as unknown as Window)
}

function getContainer(): AnchorContainer {
  return props.getContainer?.() ?? defaultContainer()
}

function registerLink(href: string, targetOffset?: number) {
  if (!links.value.includes(href)) {
    links.value = [...links.value, href]
  }
  if (targetOffset !== undefined) {
    linkTargetOffsets.value = { ...linkTargetOffsets.value, [href]: targetOffset }
  }
}

function unregisterLink(href: string) {
  links.value = links.value.filter((item) => item !== href)
  const next = { ...linkTargetOffsets.value }
  delete next[href]
  linkTargetOffsets.value = next
}

function resolveSpyOffset(): number {
  return props.targetOffset ?? props.offsetTop ?? 0
}

function getInternalCurrentAnchor(): string {
  const container = getContainer()
  const spyOffset = resolveSpyOffset()
  const sections: { link: string; top: number }[] = []

  for (const link of links.value) {
    const id = extractHashId(link)
    if (!id) continue
    const target = resolveScrollTarget(id)
    if (!target) continue
    const linkOffset = linkTargetOffsets.value[link] ?? spyOffset
    const top = getOffsetTop(target, container)
    if (top <= linkOffset + resolvedBounds.value) {
      sections.push({ link, top })
    }
  }

  if (!sections.length) return ''
  return sections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev)).link
}

function setCurrentActiveLink(link: string, force = false) {
  const customized = props.getCurrentAnchor?.(link) ?? link
  if (activeLink.value === customized && !force) return
  activeLink.value = customized || null
  if (link) emit('change', link)
  void nextTick(updateInk)
}

function updateInk() {
  const wrapper = wrapperRef.value
  const ink = inkRef.value
  if (!wrapper || !ink) return
  const activeEl = wrapper.querySelector<HTMLElement>('.m-anchor__link--active')
  if (!activeEl) {
    ink.style.opacity = '0'
    return
  }
  ink.style.opacity = '1'
  if (props.direction === 'horizontal') {
    ink.style.top = ''
    ink.style.height = ''
    ink.style.left = `${activeEl.offsetLeft}px`
    ink.style.width = `${activeEl.clientWidth}px`
  } else {
    ink.style.left = ''
    ink.style.width = ''
    ink.style.top = `${activeEl.offsetTop + activeEl.clientHeight / 2}px`
    ink.style.height = `${activeEl.clientHeight}px`
  }
}

function handleScroll() {
  if (animating.value) return
  const current = getInternalCurrentAnchor()
  setCurrentActiveLink(current)
}

function scrollToLink(href: string, linkTargetOffset?: number) {
  const id = extractHashId(href)
  if (!id) return
  const target = resolveScrollTarget(id)
  if (!target) return

  const container = getContainer()
  const offset = linkTargetOffset ?? props.targetOffset ?? props.offsetTop ?? 0
  animating.value = true

  if (container === window) {
    const top =
      target.getBoundingClientRect().top + getScrollTop(window) - offset
    scrollContainerTo(window, top, 'smooth')
  } else {
    const el = container as HTMLElement
    const top =
      getOffsetTop(target, el) + el.scrollTop - offset
    scrollContainerTo(el, top, 'smooth')
  }

  setCurrentActiveLink(href, true)
  window.setTimeout(() => {
    animating.value = false
  }, 400)
}

function onLinkClick(
  event: MouseEvent,
  link: { href: string; title?: unknown },
  linkTargetOffset?: number,
) {
  emit('click', event, link)
  if (event.defaultPrevented) return

  const id = extractHashId(link.href)
  if (id) {
    event.preventDefault()
    scrollToLink(link.href, linkTargetOffset)
    if (props.replace && typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', link.href)
    }
  }
}

provide(anchorContextKey, {
  registerLink,
  unregisterLink,
  activeLink,
  direction: props.direction,
  scrollTo: scrollToLink,
  onLinkClick,
})

const rootClass = computed(() => [
  'm-anchor',
  `m-anchor--${props.direction}`,
  {
    'm-anchor--affix': props.affix,
  },
])

const affixStyle = computed(() => {
  if (!props.affix || props.offsetTop == null) return undefined
  return { top: `${props.offsetTop}px` }
})

let scrollTarget: AnchorContainer | Window | null = null

function bindScroll() {
  unbindScroll()
  scrollTarget = getContainer()
  scrollTarget.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

function unbindScroll() {
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', handleScroll)
    scrollTarget = null
  }
}

onMounted(() => {
  bindScroll()
  void nextTick(updateInk)
})

onBeforeUnmount(unbindScroll)

watch(
  () => props.getContainer,
  () => {
    bindScroll()
  },
)

watch(links, () => {
  handleScroll()
  void nextTick(updateInk)
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="rootClass"
  >
    <div
      class="m-anchor__affix"
      :style="affixStyle"
    >
      <div
        ref="wrapperRef"
        class="m-anchor__list"
      >
        <span
          ref="inkRef"
          class="m-anchor__ink"
          aria-hidden="true"
        />
        <AnchorItems
          v-if="items?.length"
          :items="items"
        />
        <slot v-else />
      </div>
    </div>
  </div>
</template>
