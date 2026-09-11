<script setup lang="ts">

defineOptions({ inheritAttrs: false })
import type { BreadcrumbItem, BreadcrumbProps } from './types'
import { useRootParts } from '../../shared/useComponentAttrs'
import { computed, useAttrs } from 'vue'
import { useMLocale } from '../../locale'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
})
const attrs = useAttrs()
const { rootAttrs } = useRootParts(attrs, () => props.pt)

const locale = useMLocale()

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
  <nav v-bind="rootAttrs" class="m-breadcrumb" :aria-label="locale.breadcrumb">
    <ol class="m-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="m-breadcrumb__item">
        <slot
          name="item"
          :item="item"
          :index="index"
          :active="index === items.length - 1"
        >
          <a
            v-if="item.to && !item.disabled"
            class="m-breadcrumb__link"
            :href="item.to"
          >
            {{ item.label }}
          </a>
          <span
            v-else
            class="m-breadcrumb__link"
            :class="{
              'm-breadcrumb__link--current': index === items.length - 1,
              'm-breadcrumb__link--disabled': item.disabled,
            }"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </slot>
        <span v-if="index < items.length - 1" class="m-breadcrumb__separator" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
