<script setup lang="ts">
import type { TimelineEvent } from 'morya-ui'
import { MTimeline } from 'morya-ui'

const events: TimelineEvent[] = [
  { status: 'Ordered', date: '15/10/2024', content: 'Order placed', icon: 'check', type: 'success' },
  { status: 'Shipped', date: '16/10/2024', content: 'On the way', icon: 'upload', type: 'info' },
  { status: 'Delivered', date: '17/10/2024', content: 'Arrived', icon: 'home', type: 'success' },
]
</script>

<template>
  <MTimeline :value="events" align="alternate" />
</template>
