<script setup lang="ts">
import type { CarouselItemProps } from './types'
import { useAttrs } from 'vue'
import { useRootParts } from '../../shared/useComponentAttrs'
import { M_CAROUSEL_ITEM_FLAG } from './types'

defineOptions({
  name: 'MCarouselItem',
  inheritAttrs: false,
  [M_CAROUSEL_ITEM_FLAG]: true,
} as Record<string, unknown>)

const props = defineProps<CarouselItemProps>()
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="m-carousel__slide-content"
  >
    <slot />
  </div>
</template>
