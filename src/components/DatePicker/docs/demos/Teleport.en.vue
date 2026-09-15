<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
</script>

<template>
  <MDatePicker v-model="value" label="In-place panel" append-to="self" />
</template>
