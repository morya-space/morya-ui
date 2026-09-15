<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<Array<string | number>>(['design'])
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
  { label: 'Research', value: 'research' },
]
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MSelect v-model="value" :options="options" multiple show-clear placeholder="Teams" />
    <MSelect v-model="value" :options="options" multiple :max-tag-count="1" placeholder="Collapsed tags" />
  </div>
</template>
