<script setup lang="ts">
import type { Component, VNode, VNodeChild } from 'vue'
import type { IconName } from '../Icon/types'
import type { ButtonColor, ButtonProps } from './types'
import {
  Comment,
  Fragment,
  Text,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import {
  getComponentDefault,
  useConfiguredSize,
  useDisabled,
  useMConfig,
} from '../../shared/config'
import { resolveIconSizeFromClass } from '../../shared/types'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'
import {
  formatButtonLabel,
  getLoadingConfig,
  isTwoCNChar,
  isUnBorderedButtonVariant,
  resolveButtonAppearance,
} from './buttonHelpers'

defineOptions({ inheritAttrs: false })

const RIPPLE_MS_FALLBACK = 560

const props = withDefaults(defineProps<ButtonProps>(), {
  type: undefined,
  color: undefined,
  variant: undefined,
  danger: false,
  ghost: false,
  shape: 'default',
  block: false,
  loading: false,
  disabled: undefined,
  htmlType: 'button',
  iconPlacement: 'start',
  iconOnly: false,
  autoInsertSpace: undefined,
  badgeColor: null,
  autofocus: false,
  ripple: false,
  press: false,
})

const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const slots = useSlots()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const buttonElement = ref<HTMLButtonElement | HTMLAnchorElement | null>(null)
const rippleLayer = ref<HTMLSpanElement | null>(null)
const rippleAnimations = new Set<Animation>()
const hasTwoCNChar = ref(false)
const innerLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

const config = useMConfig()
const mergedDisabled = useDisabled(() => props.disabled)
const resolvedSize = useConfiguredSize('Button', () => props.size)
const iconSize = computed(() => resolveIconSizeFromClass(resolvedSize.value))

const contextColor = computed(() =>
  getComponentDefault<ButtonColor>(config.value.componentDefaults, 'Button', 'color'),
)
const contextVariant = computed(() =>
  getComponentDefault<ButtonProps['variant']>(config.value.componentDefaults, 'Button', 'variant'),
)
const contextShape = computed(() =>
  getComponentDefault<ButtonProps['shape']>(config.value.componentDefaults, 'Button', 'shape') ?? 'default',
)
const contextAutoInsertSpace = computed(() =>
  getComponentDefault<boolean>(config.value.componentDefaults, 'Button', 'autoInsertSpace'),
)
const contextRipple = computed(() =>
  getComponentDefault<boolean>(config.value.componentDefaults, 'Button', 'ripple'),
)
const contextPress = computed(() =>
  getComponentDefault<boolean>(config.value.componentDefaults, 'Button', 'press'),
)

const mergedShape = computed(() => props.shape || contextShape.value || 'default')
const mergedAutoInsertSpace = computed(
  () => props.autoInsertSpace ?? contextAutoInsertSpace.value ?? true,
)
const mergedRipple = computed(() => props.ripple || contextRipple.value || false)
const mergedPress = computed(() => props.press || contextPress.value || false)

const appearance = computed(() =>
  resolveButtonAppearance({
    color: props.color,
    variant: props.variant,
    type: props.type,
    danger: props.danger,
    ghost: props.ghost,
    contextColor: contextColor.value,
    contextVariant: contextVariant.value,
  }),
)

const loadingConfig = computed(() => getLoadingConfig(props.loading))

watch(
  loadingConfig,
  (cfg) => {
    if (loadingTimer !== undefined) {
      clearTimeout(loadingTimer)
      loadingTimer = undefined
    }
    if (cfg.delay > 0 && (props.loading === true || (props.loading && typeof props.loading === 'object'))) {
      innerLoading.value = false
      loadingTimer = setTimeout(() => {
        innerLoading.value = true
        loadingTimer = undefined
      }, cfg.delay)
      return
    }
    innerLoading.value = cfg.loading
  },
  { immediate: true },
)

const hasDefaultContent = computed(() =>
  Boolean(slots.default?.().some((node) => hasRenderableContent(node))),
)
const hasLabel = computed(() => hasDefaultContent.value || Boolean(props.label?.trim()))

const isIconOnly = computed(
  () =>
    props.iconOnly
    || ((!hasLabel.value) && Boolean(props.icon || slots.icon || innerLoading.value)),
)

const iconName = computed(() => (typeof props.icon === 'string' ? (props.icon as IconName) : undefined))
const iconComponent = computed(() =>
  typeof props.icon === 'string' || !props.icon ? undefined : props.icon,
)

const loadingIconName = computed(() => {
  const icon = loadingConfig.value.icon
  return typeof icon === 'string' ? (icon as IconName) : undefined
})
const loadingIconComponent = computed(() => {
  const icon = loadingConfig.value.icon
  return typeof icon === 'string' || !icon ? undefined : (icon as Component)
})

const displayLabel = computed(() => {
  if (!props.label) return ''
  return formatButtonLabel(props.label, mergedAutoInsertSpace.value && !innerLoading.value)
})

const isAnchor = computed(() => props.href !== undefined)

const buttonClass = computed(() => [
  'm-button',
  `m-button--color-${appearance.value.color === 'danger' ? 'danger' : appearance.value.color}`,
  `m-button--variant-${appearance.value.variant}`,
  `m-button--${resolvedSize.value}`,
  `m-button--shape-${mergedShape.value}`,
  {
    'm-button--ghost': appearance.value.ghost,
    'm-button--block': props.block,
    'm-button--loading': innerLoading.value,
    'm-button--icon-only': isIconOnly.value,
    'm-button--icon-end': props.iconPlacement === 'end',
    'm-button--two-chinese-chars': hasTwoCNChar.value && mergedAutoInsertSpace.value && !innerLoading.value,
    'm-button--ripple': mergedRipple.value,
    'm-button--press': mergedPress.value,
    'm-button--disabled': mergedDisabled.value && isAnchor.value,
  },
])

const badgeClass = computed(() => [
  'm-button__badge',
  props.badgeColor
    ? `m-button__badge--${props.badgeColor === 'warning' ? 'warn' : props.badgeColor}`
    : 'm-button__badge--contrast',
])

const needInserted = computed(
  () =>
    !props.icon
    && !slots.icon
    && !isIconOnly.value
    && !isUnBorderedButtonVariant(appearance.value.variant),
)

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

function syncTwoCNChar() {
  if (!buttonElement.value || !mergedAutoInsertSpace.value || !needInserted.value) {
    hasTwoCNChar.value = false
    return
  }
  const text = (buttonElement.value.textContent || '').replace(/\s/g, '')
  hasTwoCNChar.value = isTwoCNChar(text)
}

watch(
  () => [props.label, hasDefaultContent.value, mergedAutoInsertSpace.value, needInserted.value, innerLoading.value],
  async () => {
    await nextTick()
    syncTwoCNChar()
  },
)

onMounted(() => {
  syncTwoCNChar()
  if (props.autofocus) buttonElement.value?.focus()
})

function shouldSkipRipple(): boolean {
  if (!mergedRipple.value) return true
  if (typeof document === 'undefined') return true
  if (isUnBorderedButtonVariant(appearance.value.variant)) return true
  return document.documentElement.dataset.mMotion === 'none'
}

function rippleDuration(): number {
  const button = buttonElement.value
  if (button && typeof getComputedStyle === 'function') {
    const raw = getComputedStyle(button).getPropertyValue('--m-button-ripple-duration').trim()
    const ms = Number.parseFloat(raw)
    if (Number.isFinite(ms)) return ms
  }
  return RIPPLE_MS_FALLBACK
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

  wave.classList.add('m-button__ripple-wave--fallback')
  window.setTimeout(finish, duration)
}

function handlePointerDown(event: PointerEvent) {
  if (mergedDisabled.value || innerLoading.value) return
  if (event.button !== 0) return
  spawnRipple(event.clientX, event.clientY)
}

function handleClick(event: MouseEvent) {
  if (mergedDisabled.value || innerLoading.value) {
    event.preventDefault()
    return
  }
  if (event.detail === 0) spawnRipple(0, 0, true)
  emit('click', event)
}

function focus() {
  buttonElement.value?.focus()
}

onBeforeUnmount(() => {
  if (loadingTimer !== undefined) clearTimeout(loadingTimer)
  for (const animation of rippleAnimations) animation.cancel()
  rippleAnimations.clear()
})

defineExpose({ focus, ref: buttonElement })
</script>

<template>
  <component
    :is="isAnchor ? 'a' : 'button'"
    ref="buttonElement"
    v-bind="rootAttrs"
    :class="buttonClass"
    :type="isAnchor ? undefined : htmlType"
    :href="isAnchor ? (mergedDisabled ? undefined : href) : undefined"
    :target="isAnchor ? target : undefined"
    :disabled="isAnchor ? undefined : (mergedDisabled || innerLoading)"
    :tabindex="isAnchor && mergedDisabled ? -1 : undefined"
    :aria-disabled="isAnchor && mergedDisabled ? true : undefined"
    :aria-busy="innerLoading || undefined"
    :aria-label="ariaLabel || (isIconOnly ? label : undefined)"
    :autofocus="!isAnchor && autofocus ? true : undefined"
    @pointerdown="handlePointerDown"
    @click="handleClick"
  >
    <span v-if="mergedRipple" ref="rippleLayer" class="m-button__ripple" aria-hidden="true" />

    <span
      v-if="innerLoading || icon || $slots.icon || $slots.loadingicon"
      class="m-button__icon"
      :class="{ 'm-button__icon--loading': innerLoading }"
      aria-hidden="true"
      v-bind="pt?.icon"
    >
      <template v-if="innerLoading">
        <slot name="loadingicon">
          <MIcon v-if="loadingIconName" :name="loadingIconName" :size="iconSize" />
          <component
            :is="loadingIconComponent"
            v-else-if="loadingIconComponent"
            class="m-button__icon-graphic"
          />
          <span v-else class="m-button__spinner" />
        </slot>
      </template>
      <template v-else>
        <slot name="icon">
          <MIcon v-if="iconName" :name="iconName" :size="iconSize" />
          <component :is="iconComponent" v-else-if="iconComponent" class="m-button__icon-graphic" />
        </slot>
      </template>
    </span>

    <span
      v-if="hasLabel && !iconOnly"
      class="m-button__label"
      v-bind="pt?.content"
    >
      <slot>{{ displayLabel }}</slot>
    </span>

    <span
      v-if="badge != null && badge !== ''"
      :class="badgeClass"
      v-bind="pt?.badge"
    >{{ badge }}</span>
  </component>
</template>
