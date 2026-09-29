<script setup lang="ts">
import type { AnchorLinkItem } from './types'
import MAnchorLink from './AnchorLink.vue'

defineProps<{ items: AnchorLinkItem[] }>()
</script>

<template>
  <template
    v-for="(item, index) in items"
    :key="item.key ?? item.href ?? index"
  >
    <MAnchorLink
      :href="item.href"
      :title="item.title"
      :target="item.target"
      :replace="item.replace"
      :target-offset="item.targetOffset"
    >
      <template v-if="item.children?.length">
        <MAnchorItems :items="item.children" />
      </template>
    </MAnchorLink>
  </template>
</template>
