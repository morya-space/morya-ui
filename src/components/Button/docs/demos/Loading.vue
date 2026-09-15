<script setup lang="ts">
import { MButton } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(false)

function toggleLoading() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 900)
}
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Search" icon="search" :loading="loading" @click="toggleLoading" />
    <MButton label="Always Loading" loading severity="secondary" />
  </div>
</template>
