<script setup lang="ts">
import { MListbox } from 'morya-ui'
import { ref } from 'vue'

const value = ref('a')
const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]
</script>

<template>
  <MListbox v-model="value" :options="options" filter list-style="max-height: 12rem" />
</template>
