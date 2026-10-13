<script setup lang="ts">
import { MColorPicker } from 'morya-ui'
import { ref } from 'vue'

const color = ref('#1677ff')
</script>

<template>
  <MColorPicker v-model="color" />
</template>
