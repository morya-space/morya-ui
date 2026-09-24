<script setup lang="ts">
import type {VNode, VNodeChild} from 'vue';
import type { IconName } from '../Icon/types'
import type { ButtonProps } from './types'
import { Comment, computed, Fragment, onBeforeUnmount, ref, Text, useSlots   } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import MIcon from '../Icon/Icon.vue'

const RIPPLE_MS = 560
const RIPPLE_MS_REDUCED = 280

const props = withDefaults(defineProps<ButtonProps>(), {
  iconPos: 'left',
  iconOnly: false,
  raised: false,
  rounded: false,
  text: false,
  outlined: false,
  link: false,
  ghost: false,
  quaternary: false,
  plain: false,
  fluid: false,
  loading: false,
  disabled: false,
  autofocus: false,
  nativeType: 'button',
  badgeSeverity: null,
  ripple: true,
  press: true,
})

const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const slots = useSlots()
const buttonElement = ref<HTMLButtonElement | null>(null)
const rippleLayer = ref<HTMLSpanElement | null>(null)
const rippleAnimations = new Set<Animation>()

const hasDefaultContent = computed(() => Boolean(slots.default?.().some((node) => hasRenderableContent(node))))
const hasLabel = computed(() => hasDefaultContent.value || Boolean(props.label?.trim()))

const isOutlined = computed(() => props.outlined || props.variant === 'outlined')
const isText = computed(() => props.text || props.variant === 'text')
const isLink = computed(() => props.link || props.variant === 'link')
const isGhost = computed(() => props.ghost || props.variant === 'ghost')
const isQuaternary = computed(() => props.quaternary || props.variant === 'quaternary')
const isFluid = computed(() => props.fluid)

const resolvedSize = useConfiguredSize('Button', () => props.size)

const iconSize = computed(() => resolveIconSizeFromClass(resolvedSize.value))

const isIconOnly = computed(() => props.iconOnly || ((!hasLabel.value) && Boolean(props.icon || slots.icon || props.loading)))

const severityTone = computed(() => normalizeSeverity(props.severity) ?? 'primary')

const iconName = computed(() => (typeof props.icon === 'string' ? (props.icon as IconName) : undefined))
const iconComponent = computed(() => (typeof props.icon === 'string' || !props.icon ? undefined : props.icon))

const buttonClass = computed(() => [
  'm-button',
  `m-button--${severityTone.value}`,
  `m-button--${resolvedSize.value}`,
  `m-button--icon-${props.iconPos}`,
  {
    'm-button--raised': props.raised,
    'm-button--rounded': props.rounded,
    'm-button--text': isText.value,
    'm-button--outlined': isOutlined.value,
    'm-button--link': isLink.value,
    'm-button--ghost': isGhost.value,
    'm-button--quaternary': isQuaternary.value,
    'm-button--plain': props.plain,
    'm-button--fluid': isFluid.value,
    'm-button--loading': props.loading,
    'm-button--icon-only': isIconOnly.value,
    'm-button--custom': Boolean(props.color),
    'm-button--ripple': props.ripple,
    'm-button--press': props.press,
  },
])

const buttonStyle = computed(() =>
  props.color ? { '--m-button-color': props.color } : undefined,
)

const badgeClass = computed(() => [
  'm-button__badge',
  props.badgeSeverity ? `m-button__badge--${normalizeSeverity(props.badgeSeverity)}` : 'm-button__badge--contrast',
])

function hasRenderableContent(node: VNodeChild): boolean {
  if (node == null || typeof node === 'boolean') return false
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim().length > 0
  if (Array.isArray(node)) return node.some((child) => hasRenderableContent(child))
  if (typeof node === 'object' && 'type' in node) {
    const vnode = node as VNode
    if (vnode.type === Comment) return false
    if (vnode.type === Text) return String(vnode.children ?? '').trim().length > 0
    if (vnode.type === Fragment) return hasRenderableContent(vnode.children as VNodeChild)
    return true
  }
  return false
}

/** Honor library motion preference; only `none` disables press ink. */
function shouldSkipRipple(): boolean {
  if (!props.ripple) return true
  if (typeof document === 'undefined') return true
  return document.documentElement.dataset.mMotion === 'none'
}

function rippleDuration(): number {
  if (typeof document === 'undefined') return RIPPLE_MS
  return document.documentElement.dataset.mMotion === 'reduced' ? RIPPLE_MS_REDUCED : RIPPLE_MS
}

function spawnRipple(clientX: number, clientY: number, centered = false) {
  if (shouldSkipRipple()) return
  const button = buttonElement.value
  const layer = rippleLayer.value
  if (!button || !layer) return

  const rect = button.getBoundingClientRect()
  const size = Math.ceil(Math.hypot(rect.width, rect.height) * 2)
  const localX = centered ? rect.width / 2 : clientX - rect.left
  const localY = centered ? rect.height / 2 : clientY - rect.top

  const wave = document.createElement('span')
  wave.className = 'm-button__ripple-wave'
  wave.style.width = `${size}px`
  wave.style.height = `${size}px`
  wave.style.left = `${localX - size / 2}px`
  wave.style.top = `${localY - size / 2}px`
  layer.appendChild(wave)

  const duration = rippleDuration()
  const finish = () => {
    wave.remove()
  }

  if (typeof wave.animate === 'function') {
    const animation = wave.animate(
      [
        { transform: 'scale(0)', opacity: 0.42 },
        { transform: 'scale(0.55)', opacity: 0.22, offset: 0.55 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'forwards',
      },
    )
    rippleAnimations.add(animation)
    animation.finished.then(() => {
      rippleAnimations.delete(animation)
      finish()
    }).catch(finish)
    return
  }

  // Fallback when WAAPI is unavailable: CSS keyframes still apply.
  wave.classList.add('m-button__ripple-wave--fallback')
  window.setTimeout(finish, duration)
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled || props.loading) return
  if (event.button !== 0) return
  spawnRipple(event.clientX, event.clientY)
}

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  // Keyboard activation does not fire pointerdown with coordinates.
  if (event.detail === 0) spawnRipple(0, 0, true)
  emit('click', event)
}

function focus() {
  buttonElement.value?.focus()
}

onBeforeUnmount(() => {
  for (const animation of rippleAnimations) animation.cancel()
  rippleAnimations.clear()
})

defineExpose({ focus, ref: buttonElement })
</script>

<template>
  <button
    ref="buttonElement"
    :class="buttonClass"
    :style="buttonStyle"
    :type="nativeType"
    :disabled="disabled || loading"
    :autofocus="autofocus || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (isIconOnly ? label : undefined)"
    @pointerdown="handlePointerDown"
    @click="handleClick"
  >
    <span v-if="ripple" ref="rippleLayer" class="m-button__ripple" aria-hidden="true" />

    <span
      v-if="loading || icon || $slots.icon"
      class="m-button__icon"
      :class="{ 'm-button__icon--loading': loading }"
      aria-hidden="true"
    >
      <slot v-if="loading" name="loadingicon">
        <span class="m-button__spinner" />
      </slot>
      <template v-else>
        <slot name="icon" class="m-button__icon-slot">
          <MIcon v-if="iconName" :name="iconName" :size="iconSize" />
          <component :is="iconComponent" v-else-if="iconComponent" class="m-button__icon-graphic" />
        </slot>
      </template>
    </span>

    <span v-if="hasLabel && !iconOnly" class="m-button__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="badge != null && badge !== ''" :class="badgeClass">{{ badge }}</span>
  </button>
</template>
