<script setup lang="ts">
import { MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | undefined>()
const options = [
  { label: 'In place', value: 'local' },
  { label: 'Teleported', value: 'body' },
]
</script>

<template>
  <MSelect v-model="value" :options="options" append-to="self" placeholder="Append to self" />
</template>
