<script setup lang="ts">
import type {VNode, VNodeChild} from 'vue';
import type { IconName } from '../Icon/types'
import type { ButtonProps } from './types'
import { Comment, computed, Fragment, ref, Text, useSlots   } from 'vue'
import { useConfiguredSize } from '../../shared/config'
import { normalizeSeverity, resolveIconSizeFromClass } from '../../shared/types'
import WdIcon from '../Icon/Icon.vue'

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
})

const emit = defineEmits<{ (event: 'click', value: MouseEvent): void }>()
const slots = useSlots()
const buttonElement = ref<HTMLButtonElement | null>(null)

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
  'wd-button',
  `wd-button--${severityTone.value}`,
  `wd-button--${resolvedSize.value}`,
  `wd-button--icon-${props.iconPos}`,
  {
    'wd-button--raised': props.raised,
    'wd-button--rounded': props.rounded,
    'wd-button--text': isText.value,
    'wd-button--outlined': isOutlined.value,
    'wd-button--link': isLink.value,
    'wd-button--ghost': isGhost.value,
    'wd-button--quaternary': isQuaternary.value,
    'wd-button--plain': props.plain,
    'wd-button--fluid': isFluid.value,
    'wd-button--loading': props.loading,
    'wd-button--icon-only': isIconOnly.value,
    'wd-button--custom': Boolean(props.color),
  },
])

const buttonStyle = computed(() =>
  props.color ? { '--wd-button-color': props.color } : undefined,
)

const badgeClass = computed(() => [
  'wd-button__badge',
  props.badgeSeverity ? `wd-button__badge--${normalizeSeverity(props.badgeSeverity)}` : 'wd-button__badge--contrast',
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
    :style="buttonStyle"
    :type="nativeType"
    :disabled="disabled || loading"
    :autofocus="autofocus || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel || (isIconOnly ? label : undefined)"
    @click="handleClick"
  >
    <span
      v-if="loading || icon || $slots.icon"
      class="wd-button__icon"
      :class="{ 'wd-button__icon--loading': loading }"
      aria-hidden="true"
    >
      <slot v-if="loading" name="loadingicon">
        <span class="wd-button__spinner" />
      </slot>
      <template v-else>
        <slot name="icon" class="wd-button__icon-slot">
          <WdIcon v-if="iconName" :name="iconName" :size="iconSize" />
          <component :is="iconComponent" v-else-if="iconComponent" class="wd-button__icon-graphic" />
        </slot>
      </template>
    </span>

    <span v-if="hasLabel && !iconOnly" class="wd-button__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="badge != null && badge !== ''" :class="badgeClass">{{ badge }}</span>
  </button>
</template>
