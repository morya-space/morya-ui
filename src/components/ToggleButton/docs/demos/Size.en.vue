<script setup lang="ts">
import { MToggleButton } from 'morya-ui'
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MToggleButton v-model="a" size="small" on-label="Small" off-label="Small" />
    <MToggleButton v-model="b" on-label="Default" off-label="Default" />
    <MToggleButton v-model="c" size="large" on-label="Large" off-label="Large" />
  </div>
</template>
