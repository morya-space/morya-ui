<script setup lang="ts">
import { MInput } from 'morya-ui'
</script>

<template>
  <MInput
    label="Token"
    placeholder="sk-…"
    :pt="{
      root: { class: 'token-field' },
      input: { class: 'font-mono', autocomplete: 'off' },
    }"
  />
</template>
