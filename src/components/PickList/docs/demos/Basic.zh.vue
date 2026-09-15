<script setup lang="ts">
import { MPickList } from 'morya-ui'
import { ref } from 'vue'

const source = ref(['苹果', '香蕉', '樱桃', '葡萄'])
const target = ref(['榴莲'])
</script>

<template>
  <MPickList
    v-model:source="source"
    v-model:target="target"
    source-header="可选水果"
    target-header="已选水果"
  />
</template>
