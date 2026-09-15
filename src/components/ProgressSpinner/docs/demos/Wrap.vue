<script setup lang="ts">
import { MButton, MProgressSpinner } from 'morya-ui'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <MProgressSpinner :show="loading" description="Loading">
    <p style="margin:0">
      Form content
    </p>
  </MProgressSpinner>
  <MButton label="Toggle" size="small" @click="loading = !loading" />
</template>
