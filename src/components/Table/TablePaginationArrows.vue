<script setup lang="ts">
import { useSlots } from 'vue'
import { useWiLocale } from '../../locale'
import WiIcon from '../Icon/Icon.vue'

const props = defineProps<{
  isFirstPage?: boolean
  isLastPage?: boolean
}>()

const emit = defineEmits<{
  (event: 'clickPrevPage'): void
  (event: 'clickNextPage'): void
}>()

const slots = useSlots()
const locale = useWiLocale()

function onPrevClick() {
  if (props.isFirstPage) return
  emit('clickPrevPage')
}

function onNextClick() {
  if (props.isLastPage) return
  emit('clickNextPage')
}

function onPrevKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onPrevClick()
}

function onNextKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onNextClick()
}
</script>

<template>
  <div class="wi-table__pagination">
    <button
      type="button"
      class="wi-table__page-btn"
      :class="{ 'wi-table__page-btn--disabled': isFirstPage }"
      :disabled="isFirstPage"
      :aria-label="locale.prevPage"
      @click="onPrevClick"
      @keydown="onPrevKeydown"
    >
      <WiIcon name="chevron-left" />
    </button>
    <slot v-if="slots.buttonsPagination" name="buttonsPagination" />
    <button
      type="button"
      class="wi-table__page-btn"
      :class="{ 'wi-table__page-btn--disabled': isLastPage }"
      :disabled="isLastPage"
      :aria-label="locale.nextPage"
      @click="onNextClick"
      @keydown="onNextKeydown"
    >
      <WiIcon name="chevron-right" />
    </button>
  </div>
</template>
