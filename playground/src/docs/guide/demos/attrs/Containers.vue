<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MButton label="Open" @click="open = true" />
  <MDialog v-model="open" class="onboarding-dialog" header="Welcome">
    Content
  </MDialog>
</template>
