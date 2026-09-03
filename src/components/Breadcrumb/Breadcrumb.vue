<script setup lang="ts">
import type { BreadcrumbItem, BreadcrumbProps } from './types'
import { computed } from 'vue'
import { useWiLocale } from '../../locale'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
})
const locale = useWiLocale()

const items = computed(() => {
  const list: BreadcrumbItem[] = []
  if (props.home) {
    list.push({
      label: props.home.label ?? locale.value.home,
      to: props.home.to,
    })
  }
  list.push(...props.model)
  return list
})
</script>

<template>
  <nav class="wi-breadcrumb" :aria-label="locale.breadcrumb">
    <ol class="wi-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="wi-breadcrumb__item">
        <slot
          name="item"
          :item="item"
          :index="index"
          :active="index === items.length - 1"
        >
          <a
            v-if="item.to && !item.disabled"
            class="wi-breadcrumb__link"
            :href="item.to"
          >
            {{ item.label }}
          </a>
          <span
            v-else
            class="wi-breadcrumb__link"
            :class="{
              'wi-breadcrumb__link--current': index === items.length - 1,
              'wi-breadcrumb__link--disabled': item.disabled,
            }"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </slot>
        <span v-if="index < items.length - 1" class="wi-breadcrumb__separator" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
