<script setup lang="ts">
import type { ListItemMetaProps } from './types'
import { useSlots } from 'vue'

defineOptions({ name: 'MListItemMeta' })

defineProps<ListItemMetaProps>()
const slots = useSlots()
</script>

<template>
  <div class="m-list-item-meta">
    <div
      v-if="slots.avatar || avatar"
      class="m-list-item-meta__avatar"
    >
      <slot name="avatar">
        {{ avatar }}
      </slot>
    </div>
    <div
      v-if="slots.title || title || slots.description || description || slots.default"
      class="m-list-item-meta__content"
    >
      <div
        v-if="slots.title || title"
        class="m-list-item-meta__title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="slots.description || description"
        class="m-list-item-meta__description"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <slot />
    </div>
  </div>
</template>
