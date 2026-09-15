<script setup lang="ts">
import { MInputColor } from 'morya-ui'
import { ref } from 'vue'

const color = ref('#2563eb')
</script>

<template>
  <MInputColor v-model="color" :swatches="['#2563eb', '#16a34a', '#dc2626']" />
</template>
