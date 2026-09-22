<script setup lang="ts">
import type { LoadingProps } from './types'
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue'
import { useComponentDefaults, useMConfig } from '../../shared/config'
import { resolveOverlayTeleport } from '../../shared/overlay'
import { useRootParts } from '../../shared/useComponentAttrs'
import { useMotionTransition } from '../../theme/useMotionTransition'
import { lockLoadingScroll, unlockLoadingScroll } from './loading'
import LoadingIndicator from './LoadingIndicator.vue'
import { normalizeLoadingEffect } from './types'

defineOptions({ name: 'MLoading', inheritAttrs: false })

const props = withDefaults(defineProps<LoadingProps>(), {
  transition: undefined,
  loading: true,
  fullscreen: false,
  lock: false,
  delay: 0,
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const defaults = useComponentDefaults('Loading')
const config = useMConfig()
const { transitionName, transitionCss } = useMotionTransition({
  role: 'overlay',
  local: () => props.transition,
  componentName: 'Loading',
  fallback: 'loading',
})

const wrapping = computed(() => Boolean(slots.default))
const overlay = computed(() => wrapping.value || props.fullscreen)
const effect = computed(() => normalizeLoadingEffect(props.effect ?? defaults.value.effect))
const size = computed(() => props.size ?? (defaults.value.size as LoadingProps['size']))
const delayMs = computed(() => props.delay ?? (defaults.value.delay as number | undefined) ?? 0)
const maskStyle = computed(() => (props.background ? { background: props.background } : undefined))
const teleportTarget = computed(() =>
  resolveOverlayTeleport(
    props.fullscreen ? { teleport: true, appendTo: 'body' } : { teleport: false },
    config.value.appendTo,
  ),
)

const visible = ref(props.loading && delayMs.value <= 0)
let delayTimer: ReturnType<typeof setTimeout> | null = null

function clearDelay() {
  if (delayTimer === null) return
  clearTimeout(delayTimer)
  delayTimer = null
}

watch(
  () => [props.loading, delayMs.value, overlay.value] as const,
  ([loading, delay]) => {
    clearDelay()
    if (!loading || !overlay.value) {
      visible.value = false
      return
    }
    if (!delay) {
      visible.value = true
      return
    }
    visible.value = false
    delayTimer = setTimeout(() => {
      visible.value = true
      delayTimer = null
    }, delay)
  },
  { immediate: true },
)

const locking = computed(() => props.lock && visible.value && overlay.value)
let scrollHeld = false

watch(locking, (locked) => {
  if (locked && !scrollHeld) {
    lockLoadingScroll()
    scrollHeld = true
    return
  }
  if (!locked && scrollHeld) {
    unlockLoadingScroll()
    scrollHeld = false
  }
}, { immediate: true })

onBeforeUnmount(() => {
  clearDelay()
  if (!scrollHeld) return
  unlockLoadingScroll()
  scrollHeld = false
})
</script>

<template>
  <template v-if="overlay">
    <div
      v-if="wrapping"
      v-bind="rootAttrs"
      class="m-loading"
      :class="{ 'm-loading--active': visible }"
      :aria-busy="visible || undefined"
    >
      <div class="m-loading__content" :inert="visible || undefined">
        <slot />
      </div>
      <Teleport :to="teleportTarget.to" :disabled="teleportTarget.disabled">
        <Transition :name="transitionName" :css="transitionCss">
          <div
            v-if="visible"
            class="m-loading-mask"
            :class="[{ 'm-loading-mask--fullscreen': fullscreen }, customClass]"
            :style="maskStyle"
          >
            <slot name="indicator">
              <LoadingIndicator
                :effect="effect"
                :size="size"
                :text="text"
                :aria-label="ariaLabel"
              />
            </slot>
          </div>
        </Transition>
      </Teleport>
    </div>
    <Teleport v-else :to="teleportTarget.to" :disabled="teleportTarget.disabled">
      <Transition :name="transitionName" :css="transitionCss">
        <div
          v-if="visible"
          v-bind="rootAttrs"
          class="m-loading-mask m-loading-mask--fullscreen"
          :class="customClass"
          :style="maskStyle"
          role="presentation"
          aria-busy="true"
        >
          <slot name="indicator">
            <LoadingIndicator
              :effect="effect"
              :size="size"
              :text="text"
              :aria-label="ariaLabel"
            />
          </slot>
        </div>
      </Transition>
    </Teleport>
  </template>
  <LoadingIndicator
    v-else
    v-bind="rootAttrs"
    :effect="effect"
    :size="size"
    :text="text"
    :aria-label="ariaLabel"
  />
</template>
