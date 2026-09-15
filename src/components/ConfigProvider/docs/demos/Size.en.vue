<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider size="small">
    <div class="flex flex-wrap gap-3 items-center">
      <MButton label="Inherit small" />
      <MInput placeholder="Inherit small" class="w-40" />
      <MSelect v-model="city" :options="options" placeholder="Inherit small" class="w-40" />
      <MButton label="Override to large" size="large" />
    </div>
  </MConfigProvider>
</template>
