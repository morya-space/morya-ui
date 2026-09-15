<script setup lang="ts">
import { MPagination } from 'morya-ui'
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <div class="grid gap-4">
    <MPagination
      v-model="page"
      v-model:page-size="pageSize"
      :total-records="200"
      show-size-picker
      :page-sizes="[10, 20, 50]"
      show-quick-jumper
    />
    <MPagination v-model="page" :total-records="200" :page-size="pageSize" simple />
  </div>
</template>
