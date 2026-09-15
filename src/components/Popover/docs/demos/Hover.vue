<script setup lang="ts">
import { MButton, MPopover } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MPopover v-model="open" trigger="hover" :show-delay="80" :hide-delay="120">
    <MButton label="Hover me" severity="secondary" />
    <template #content>
      <p style="margin:0">
        Opens on hover.
      </p>
    </template>
  </MPopover>
</template>
