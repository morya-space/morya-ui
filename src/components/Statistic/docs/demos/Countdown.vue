<script setup lang="ts">
import { MStatisticCountdown } from 'morya-ui'

const deadline = Date.now() + 1000 * 60 * 60 * 2
</script>

<template>
  <MStatisticCountdown
    title="Countdown"
    :value="deadline"
    format="HH:mm:ss"
  />
</template>
