<script setup lang="ts">
import { MOrderList } from 'morya-ui'
import { ref } from 'vue'

const items = ref(['设计', '开发', '测试', '发布'])
</script>

<template>
  <MOrderList v-model="items" />
</template>
