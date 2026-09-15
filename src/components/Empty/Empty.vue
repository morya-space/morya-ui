<script setup lang="ts">
import type { EmptyProps } from './types'
import { computed, useAttrs, useSlots } from 'vue'
import { useMLocale } from '../../locale'
import { useRootParts } from '../../shared/useComponentAttrs'
import MIcon from '../Icon/Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<EmptyProps>(), {
  icon: 'database',
})

const attrs = useAttrs()
const slots = useSlots()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
const locale = useMLocale()

const resolvedTitle = computed(() => props.title ?? locale.value.emptyMessage)
const showImage = computed(() => Boolean(slots.image || props.image))
const showIcon = computed(() => !showImage.value && Boolean(slots.icon || props.icon))
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-empty"
    role="status"
  >
    <div v-if="showImage || showIcon" class="m-empty__mark" aria-hidden="true">
      <slot name="image">
        <img
          v-if="image"
          class="m-empty__image"
          :src="image"
          alt=""
        >
      </slot>
      <slot v-if="!showImage" name="icon">
        <MIcon
          v-if="icon"
          class="m-empty__icon"
          :name="icon"
          size="lg"
        />
      </slot>
    </div>

    <div
      v-if="slots.title || resolvedTitle"
      class="m-empty__title"
    >
      <slot name="title">{{ resolvedTitle }}</slot>
    </div>

    <div
      v-if="slots.description || description"
      class="m-empty__description"
    >
      <slot name="description">{{ description }}</slot>
    </div>

    <div
      v-if="slots.extra || slots.default"
      class="m-empty__extra"
    >
      <slot name="extra" />
      <slot />
    </div>
  </div>
</template>
