<script setup lang="ts">
import { MPickList } from 'morya-ui'
import { ref } from 'vue'

const source = ref(['Apple', 'Banana', 'Cherry', 'Grape'])
const target = ref(['Durian'])
</script>

<template>
  <MPickList
    v-model:source="source"
    v-model:target="target"
    source-header="Available fruit"
    target-header="Selected fruit"
  />
</template>
