<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | undefined>()
const cities = [
  { label: 'Shanghai', value: 'sh' },
  { label: 'Beijing', value: 'bj' },
  { label: 'Shenzhen', value: 'sz' },
]
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MSelect v-model="value" :options="[]" not-found-content="暂无选项" placeholder="Empty list" />
    <MSelect v-model="value" :options="cities" show-search placeholder="Filter cities" />
  </div>
</template>
