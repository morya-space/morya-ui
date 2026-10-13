<script setup lang="ts">
import { MColorPicker } from 'morya-ui'
import { ref } from 'vue'

const color = ref('linear-gradient(90deg, #1677ff 0%, #ff4d4f 100%)')
</script>

<template>
  <MColorPicker v-model="color" gradient show-text />
</template>
