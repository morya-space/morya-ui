<script setup lang="ts">
import { MPagination } from 'morya-ui'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div class="grid gap-3">
    <MPagination v-model="page" :total-records="95" :rows="10" :page-link-size="5" />
    <p style="margin:0;color:var(--m-color-text-muted);font-size:0.875rem">
      Page {{ page }} · first ≈ {{ (page - 1) * 10 }}
    </p>
  </div>
</template>
