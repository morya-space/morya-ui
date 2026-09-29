<script setup lang="ts">
import { MList, MListItem, MListItemMeta } from 'morya-ui'

const data = [
  {
    id: '1',
    title: 'morya-ui 标题 1',
    description: 'Vertical item layout with extra content on the right.',
    extra: 'extra 1',
  },
  {
    id: '2',
    title: 'morya-ui 标题 2',
    description: 'Use itemLayout="vertical" for card-like stacks.',
    extra: 'extra 2',
  },
]
</script>

<template>
  <MList
    item-layout="vertical"
    :items="data"
    row-key="id"
  >
    <template #item="{ item }">
      <MListItem>
        <template #extra>
          <div class="m-list-demo-extra">
            {{ item.extra }}
          </div>
        </template>
        <MListItemMeta
          :title="item.title"
          :description="item.description"
        />
      </MListItem>
    </template>
  </MList>
</template>

<style scoped>
.m-list-demo-extra {
  background: color-mix(in srgb, var(--m-color-primary) 8%, var(--m-color-surface));
  border-radius: var(--m-radius-control);
  color: var(--m-color-text-muted);
  font-size: var(--m-font-size-sm);
  padding: var(--m-space-6) var(--m-space-8);
}
</style>
