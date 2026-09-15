<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const q = ref('')
</script>

<template>
  <MInput
    v-model="q"
    label="搜索"
    class="toolbar-search"
    data-testid="search"
    style="max-width: 16rem"
  />
</template>
