<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  maxPaginationNumber: number
  currentPaginationNumber: number
}>()

const emit = defineEmits<{ (event: 'updatePage', page: number): void }>()

const totalVisible = 7

type PaginationItem =
  | { type: 'button'; page: number; active: boolean; activePrev: boolean }
  | { type: 'omission' }

function changePage(item: PaginationItem) {
  if (item.type === 'button' && !item.active) emit('updatePage', item.page)
}

const paginationItemsForRender = computed((): PaginationItem[] => {
  const paginationItems: PaginationItem[] = []
  if (props.maxPaginationNumber <= totalVisible) {
    for (let i = 1; i <= props.maxPaginationNumber; i += 1) {
      paginationItems.push({
        type: 'button',
        page: i,
        active: i === props.currentPaginationNumber,
        activePrev: (i + 1) === props.currentPaginationNumber,
      })
    }
  } else if (
    [1, 2, props.maxPaginationNumber, props.maxPaginationNumber - 1].includes(props.currentPaginationNumber)
  ) {
    for (let i = 1; i <= totalVisible; i += 1) {
      if (i <= 3) {
        paginationItems.push({
          type: 'button',
          page: i,
          active: i === props.currentPaginationNumber,
          activePrev: (i + 1) === props.currentPaginationNumber,
        })
      } else if (i === 4) {
        paginationItems.push({ type: 'omission' })
      } else {
        const page = props.maxPaginationNumber - (totalVisible - i)
        paginationItems.push({
          type: 'button',
          page,
          active: page === props.currentPaginationNumber,
          activePrev: (page + 1) === props.currentPaginationNumber,
        })
      }
    }
  } else if ([3, 4].includes(props.currentPaginationNumber)) {
    for (let i = 1; i <= totalVisible; i += 1) {
      if (i <= 5) {
        paginationItems.push({
          type: 'button',
          page: i,
          active: i === props.currentPaginationNumber,
          activePrev: (i + 1) === props.currentPaginationNumber,
        })
      } else if (i === 6) {
        paginationItems.push({ type: 'omission' })
      } else {
        paginationItems.push({
          type: 'button',
          page: props.maxPaginationNumber,
          active: props.maxPaginationNumber === props.currentPaginationNumber,
          activePrev: false,
        })
      }
    }
  } else if (
    [props.maxPaginationNumber - 2, props.maxPaginationNumber - 3].includes(props.currentPaginationNumber)
  ) {
    for (let i = 1; i <= totalVisible; i += 1) {
      if (i === 1) {
        paginationItems.push({
          type: 'button',
          page: 1,
          active: props.currentPaginationNumber === 1,
          activePrev: (i + 1) === props.currentPaginationNumber,
        })
      } else if (i === 2) {
        paginationItems.push({ type: 'omission' })
      } else {
        const page = props.maxPaginationNumber - (totalVisible - i)
        paginationItems.push({
          type: 'button',
          page,
          active: page === props.currentPaginationNumber,
          activePrev: (page + 1) === props.currentPaginationNumber,
        })
      }
    }
  } else {
    for (let i = 1; i <= totalVisible; i += 1) {
      if (i === 1) {
        paginationItems.push({
          type: 'button',
          page: 1,
          active: props.currentPaginationNumber === 1,
          activePrev: (i + 1) === props.currentPaginationNumber,
        })
      } else if (i === 2 || i === 6) {
        paginationItems.push({ type: 'omission' })
      } else if (i === 7) {
        paginationItems.push({
          type: 'button',
          page: props.maxPaginationNumber,
          active: props.maxPaginationNumber === props.currentPaginationNumber,
          activePrev: false,
        })
      } else {
        const diff = 4 - i
        const page = props.currentPaginationNumber - diff
        paginationItems.push({
          type: 'button',
          page,
          active: page === props.currentPaginationNumber,
          activePrev: (page + 1) === props.currentPaginationNumber,
        })
      }
    }
  }
  return paginationItems
})
</script>

<template>
  <div class="wi-table__buttons-pagination">
    <button
      v-for="(item, i) in paginationItemsForRender"
      :key="i"
      type="button"
      class="wi-table__buttons-pagination-item"
      :class="{
        'wi-table__buttons-pagination-item--button': item.type === 'button',
        'wi-table__buttons-pagination-item--active': item.type === 'button' && item.active,
        'wi-table__buttons-pagination-item--omission': item.type === 'omission',
      }"
      :disabled="item.type === 'omission'"
      @click="changePage(item)"
    >
      {{ item.type === 'button' ? item.page : '...' }}
    </button>
  </div>
</template>
