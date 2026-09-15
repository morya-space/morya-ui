<script setup lang="ts">
import { MTimeline } from 'morya-ui'

const events = [
  { status: 'Start', date: '周一', content: 'Kickoff', icon: 'check' },
  { status: 'Build', date: '周三', content: 'Implementation', icon: 'settings' },
  { status: 'Ship', date: '周五', content: 'Release', icon: 'check-circle' },
]
</script>

<template>
  <MTimeline :value="events" layout="horizontal" />
</template>
