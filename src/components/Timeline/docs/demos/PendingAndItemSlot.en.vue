<script setup lang="ts">
import { MTimeline } from 'morya-ui'

const events = [
  { status: 'Done', date: 'Mon', content: 'Shipped' },
]
</script>

<template>
  <MTimeline :value="events" pending="Waiting">
    <template #item="{ item }">
      <span>{{ item.content || item.status }}</span>
    </template>
  </MTimeline>
</template>
