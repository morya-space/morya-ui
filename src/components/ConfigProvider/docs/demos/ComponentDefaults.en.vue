<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSpace } from 'morya-ui'
import { ref } from 'vue'

const note = ref('Clearable')
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
      <MButton label="Still large" />
      <MInput v-model="note" placeholder="Input defaults to small + clearable" class="w-56" />
    </MSpace>
  </MConfigProvider>
</template>
