<script setup lang="ts">
import { MInput, MInputGroup, MInputGroupAddon } from 'morya-ui'
import { ref } from 'vue'

const price = ref('')
const url = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(28rem,100%)">
    <MInputGroup>
      <MInputGroupAddon>$</MInputGroupAddon>
      <MInput v-model="price" placeholder="Price" fluid />
      <MInputGroupAddon>.00</MInputGroupAddon>
    </MInputGroup>
    <MInputGroup>
      <MInputGroupAddon>https://</MInputGroupAddon>
      <MInput v-model="url" placeholder="example.com" fluid />
    </MInputGroup>
  </div>
</template>
