<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | undefined>()
const loading = ref(false)
const options = ref<{ label: string; value: string }[]>([])
const catalog = [
  { label: 'Shanghai', value: 'sh' },
  { label: 'Beijing', value: 'bj' },
  { label: 'Shenzhen', value: 'sz' },
]

function onSearch(query: string) {
  if (!query) {
    options.value = []
    return
  }
  loading.value = true
  window.setTimeout(() => {
    const needle = query.toLowerCase()
    options.value = catalog.filter((item) => item.label.toLowerCase().includes(needle))
    loading.value = false
  }, 400)
}
</script>

<template>
  <MSelect
    v-model="value"
    :options="options"
    filter
    remote
    :loading="loading"
    placeholder="Search a city"
    @search="onSearch"
  />
</template>
