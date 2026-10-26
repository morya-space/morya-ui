<script setup lang="ts">
import { MPagination } from 'morya-ui'
import { ref } from 'vue'

const page = ref(1)
const rows = ref(10)
</script>

<template>
  <div class="grid gap-4">
    <MPagination
      v-model="page"
      v-model:rows="rows"
      :total-records="200"
      show-size-picker
      :page-sizes="[10, 20, 50]"
      show-quick-jumper
    />
    <MPagination v-model="page" :total-records="200" :rows="rows" simple />
  </div>
</template>
