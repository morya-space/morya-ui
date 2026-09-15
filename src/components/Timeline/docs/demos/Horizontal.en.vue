<script setup lang="ts">
import { MTimeline } from 'morya-ui'

const events = [
  { status: 'Start', date: 'Monday', content: 'Kickoff', icon: 'check' },
  { status: 'Build', date: 'Wednesday', content: 'Implementation', icon: 'settings' },
  { status: 'Ship', date: 'Friday', content: 'Release', icon: 'check-circle' },
]
</script>

<template>
  <MTimeline :value="events" layout="horizontal" />
</template>
