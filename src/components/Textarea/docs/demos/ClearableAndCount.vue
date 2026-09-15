<script setup lang="ts">
import { MTextarea } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Draft notes')
</script>

<template>
  <MTextarea v-model="value" label="Notes" clearable show-count :maxlength="120" :rows="3" />
</template>
