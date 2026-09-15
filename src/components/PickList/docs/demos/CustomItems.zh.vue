<script setup lang="ts">
import { MPickList } from 'morya-ui'
import { ref } from 'vue'

const source = ref([
  { id: 1, name: '设计' },
  { id: 2, name: '研发' },
])
const target = ref([{ id: 3, name: '测试' }])
</script>

<template>
  <MPickList v-model:source="source" v-model:target="target" data-key="id">
    <template #item="{ item }">
      <strong>{{ (item as { name: string }).name }}</strong>
    </template>
  </MPickList>
</template>
