<script setup lang="ts">
import { MMentions } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
const options = ['afc163', 'benjyew', 'zombieJ', 'yesmeck']
</script>

<template>
  <MMentions v-model="value" :options="options" placeholder="Type @ to mention" />
</template>
