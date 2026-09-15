<script setup lang="ts">
import { MToggleButton } from 'morya-ui'
import { ref } from 'vue'

const a = ref(false)
const b = ref(true)
const c = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MToggleButton v-model="a" size="small" on-label="小" off-label="小" />
    <MToggleButton v-model="b" on-label="默认" off-label="默认" />
    <MToggleButton v-model="c" size="large" on-label="大" off-label="大" />
  </div>
</template>
