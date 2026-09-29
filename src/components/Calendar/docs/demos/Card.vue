<script setup lang="ts">
import { ref } from 'vue'
import { MCalendar } from 'morya-ui'

const value = ref<string | null>('2024-06-15')
</script>

<template>
  <div style="max-width: 22rem;">
    <MCalendar
      v-model="value"
      :fullscreen="false"
    />
  </div>
</template>
