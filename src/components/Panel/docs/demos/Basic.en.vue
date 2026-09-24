<script setup lang="ts">
import { MPanel } from 'morya-ui'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <MPanel v-model="collapsed" header="Panel" toggleable class="w-[300px]">
    <p style="margin:0">
      Collapsible panel content.
    </p>
    <template #footer>
      Actions
    </template>
  </MPanel>
</template>
