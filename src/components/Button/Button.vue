<script setup lang="ts">
import { Comment, Fragment, Text, computed, ref, useSlots, type VNode, type VNodeChild } from 'vue'
import { useWiConfig } from '../../shared/config'
import { resolveSizeClass } from '../../shared/types'
import WiIcon from '../Icon/Icon.vue'
import type { IconName } from '../Icon/types'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  iconPos: 'left',
  iconOnly: false,
  raised: false,
  rounded: false,
  text: false,
  outlined: false,
  link: false,
  plain: false,
  fluid: false,
  block: false,
  loading: false,
  disabled: false,
  autofocus: false,
  nativeType: 'button',
  badgeSeverity: null,
})

const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const config = useWiConfig()
const slots = useSlots()
const buttonElement = ref<HTMLButtonElement | null>(null)

const hasDefaultContent = computed(() => Boolean(slots.default?.().some((node) => hasRenderableContent(node))))
const hasLabel = computed(() => hasDefaultContent.value || Boolean(props.label?.trim()))

const isOutlined = computed(() => props.outlined || props.variant === 'outlined')
const isText = computed(() => props.text || props.variant === 'text')
const isLink = computed(() => props.link || props.variant === 'link')
const isFluid = computed(() => props.fluid || props.block)

const resolvedSize = computed(() => resolveSizeClass(props.size ?? config.value.size))

const isIconOnly = computed(() => props.iconOnly || ((!hasLabel.value) && Boolean(props.icon || slots.icon || props.loading)))

const severityTone = computed(() => props.severity ?? 'primary')

const iconName = computed(() => (typeof props.icon === 'string' ? (props.icon as IconName) : undefined))
const iconComponent = computed(() => (typeof props.icon === 'string' || !props.icon ? undefined : props.icon))

const buttonClass = computed(() => [
  'wi-button',
  `wi-button--${severityTone.value}`,
  `wi-button--${resolvedSize.value}`,
  `wi-button--icon-${props.iconPos}`,
  {
    'wi-button--raised': props.raised,
    'wi-button--rounded': props.rounded,
    'wi-button--text': isText.value,
    'wi-button--outlined': isOutlined.value,
    'wi-button--link': isLink.value,
    'wi-button--plain': props.plain,
    'wi-button--fluid': isFluid.value,
    'wi-button--loading': props.loading,
    'wi-button--icon-only': isIconOnly.value,
  },
])

const badgeClass = computed(() => [
  'wi-button__badge',
  props.badgeSeverity ? `wi-button__badge--${props.badgeSeverity}` : 'wi-button__badge--contrast',
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

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', event)
}

function focus() {
  buttonElement.value?.focus()
}

defineExpose({ focus, ref: buttonElement })
</script>

<template>
  <button
    ref="buttonElement"
    :class="buttonClass"
    :type="nativeType"
    :disabled="disabled || loading"
    :autofocus="autofocus || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (isIconOnly ? label : undefined)"
    @click="handleClick"
  >
    <span
      v-if="loading || icon || $slots.icon"
      class="wi-button__icon"
      :class="{ 'wi-button__icon--loading': loading }"
      aria-hidden="true"
    >
      <slot v-if="loading" name="loadingicon">
        <span class="wi-button__spinner" />
      </slot>
      <template v-else>
        <slot name="icon" :class="'wi-button__icon-slot'">
          <WiIcon v-if="iconName" :name="iconName" size="sm" />
          <component :is="iconComponent" v-else-if="iconComponent" />
        </slot>
      </template>
    </span>

    <span v-if="hasLabel && !iconOnly" class="wi-button__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="badge != null && badge !== ''" :class="badgeClass">{{ badge }}</span>
  </button>
</template>
