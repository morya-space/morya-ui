<script setup lang="ts">
import type { AnchorLinkProps } from './types'
import { computed, inject, onBeforeUnmount, onMounted, useAttrs, useSlots } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { anchorContextKey } from './anchorContext'

defineOptions({ inheritAttrs: false })

const props = defineProps<AnchorLinkProps>()
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const ctx = inject(anchorContextKey, null)

const active = computed(() => ctx?.activeLink.value === props.href)

const linkClass = computed(() => [
  'm-anchor__link',
  {
    'm-anchor__link--active': active.value,
  },
])

onMounted(() => {
  ctx?.registerLink(props.href, props.targetOffset)
})

onBeforeUnmount(() => {
  ctx?.unregisterLink(props.href)
})

function onClick(event: MouseEvent) {
  emit('click', event)
  ctx?.onLinkClick(
    event,
    { href: props.href, title: props.title },
    props.targetOffset,
  )
}
</script>

<template>
  <div
    class="m-anchor__item"
    :class="{ 'm-anchor__item--active': active }"
  >
    <a
      v-bind="rootAttrs"
      :class="linkClass"
      :href="href"
      :target="target"
      @click="onClick"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </a>
    <div
      v-if="slots.default"
      class="m-anchor__sub"
    >
      <slot />
    </div>
  </div>
</template>
