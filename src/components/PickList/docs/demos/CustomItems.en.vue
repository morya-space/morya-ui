<script setup lang="ts">
import { MPickList } from 'morya-ui'
import { ref } from 'vue'

const source = ref([
  { id: 1, name: 'Design' },
  { id: 2, name: 'Engineering' },
])
const target = ref([{ id: 3, name: 'Testing' }])
</script>

<template>
  <MPickList v-model:source="source" v-model:target="target" data-key="id">
    <template #item="{ item }">
      <strong>{{ item.name }}</strong>
    </template>
  </MPickList>
</template>
