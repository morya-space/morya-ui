<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | null>(null)
</script>

<template>
  <MDatePicker v-model="value" label="就地面板" append-to="self" />
</template>
