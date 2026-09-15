<script setup lang="ts">
import { MCascadeSelect } from 'morya-ui'
import { ref } from 'vue'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [
  { label: 'Books', value: 'books' },
  { label: 'Media', value: 'media' },
]
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MCascadeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <MCascadeSelect v-model="b" :options="options" placeholder="Default" />
    <MCascadeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
