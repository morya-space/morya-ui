<script setup lang="ts">
import { MTreeSelect } from 'morya-ui'
import { ref } from 'vue'

const a = ref(null)
const b = ref(null)
const c = ref(null)
const options = [{ key: 'docs', label: '文档' }]
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MTreeSelect v-model="a" size="small" :options="options" placeholder="Small" />
    <MTreeSelect v-model="b" :options="options" placeholder="Default" />
    <MTreeSelect v-model="c" size="large" :options="options" placeholder="Large" />
  </div>
</template>
