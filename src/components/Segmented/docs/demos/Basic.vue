<script setup lang="ts">
import { MSegmented } from 'morya-ui'
import { ref } from 'vue'

const value = ref('Map')
const options = ['Map', 'Transit', 'Satellite']
</script>

<template>
  <MSegmented v-model="value" :options="options" />
</template>
