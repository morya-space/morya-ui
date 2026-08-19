<script setup lang="ts">
import { computed } from 'vue'
import { useWdLocale } from '../../locale'
import type { BreadcrumbItem, BreadcrumbProps } from './types'

const props = defineProps<BreadcrumbProps>()
const locale = useWdLocale()

const items = computed(() => {
  const list: BreadcrumbItem[] = []
  if (props.home) {
    list.push({
      label: props.home.label ?? 'Home',
      to: props.home.to,
    })
  }
  list.push(...props.model)
  return list
})
</script>

<template>
  <nav class="wd-breadcrumb" :aria-label="locale.breadcrumb">
    <ol class="wd-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="wd-breadcrumb__item">
        <a
          v-if="item.to && !item.disabled"
          class="wd-breadcrumb__link"
          :href="item.to"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          class="wd-breadcrumb__link"
          :class="{
            'wd-breadcrumb__link--current': index === items.length - 1,
            'wd-breadcrumb__link--disabled': item.disabled,
          }"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
        <span v-if="index < items.length - 1" class="wd-breadcrumb__separator" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
