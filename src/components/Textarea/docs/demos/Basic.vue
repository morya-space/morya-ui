<script setup lang="ts">
import { MTextarea } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MTextarea v-model="value" label="Notes" placeholder="Write something…" />
</template>
