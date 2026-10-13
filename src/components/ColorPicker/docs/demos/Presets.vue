<script setup lang="ts">
import { MColorPicker } from 'morya-ui'
import { ref } from 'vue'

const color = ref('#1677ff')
</script>

<template>
  <MColorPicker
    v-model="color"
    :presets="[
      { label: 'Recommended', colors: ['#1677ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'] },
    ]"
  />
</template>
