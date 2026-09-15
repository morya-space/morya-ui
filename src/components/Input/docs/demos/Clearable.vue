<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Draft note')
</script>

<template>
  <MInput v-model="value" clearable label="Note" />
</template>
