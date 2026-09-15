<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const amount = ref('128')
const host = ref('docs')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MInput v-model="amount" label="Amount" fluid>
      <template #prefix>
        ¥
      </template>
      <template #suffix>
        .00
      </template>
    </MInput>
    <MInput v-model="host" label="Domain" fluid>
      <template #suffix>
        .well.design
      </template>
    </MInput>
  </div>
</template>
