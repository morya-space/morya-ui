<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSpace } from 'morya-ui'
import { ref } from 'vue'

const note = ref('可清除')
</script>

<template>
  <MConfigProvider
    size="large"
    :component-defaults="{
      Input: { size: 'small', clearable: true },
      Space: { size: 16 },
    }"
  >
    <MSpace>
      <MButton label="仍是 large" />
      <MInput v-model="note" placeholder="Input 默认 small + clearable" class="w-56" />
    </MSpace>
  </MConfigProvider>
</template>
