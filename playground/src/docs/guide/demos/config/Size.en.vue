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
  <div class="grid gap-4">
    <div>
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted);font-size:0.75rem">
        Default size
      </p>
      <div class="flex flex-wrap gap-3 items-center">
        <MButton label="Button" />
        <MInput placeholder="Input" class="w-40" />
        <MSelect v-model="city" :options="options" class="w-40" />
      </div>
    </div>
    <MConfigProvider size="small">
      <p style="margin:0 0 0.5rem;color:var(--m-color-text-muted);font-size:0.75rem">
        Config size="small"
      </p>
      <div class="flex flex-wrap gap-3 items-center">
        <MButton label="Button" />
        <MInput placeholder="Input" class="w-40" />
        <MSelect v-model="city" :options="options" class="w-40" />
      </div>
    </MConfigProvider>
  </div>
</template>
