<script setup lang="ts">
import { MButton, MPopover } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MPopover v-model="open" placement="bottom">
    <MButton label="Toggle Popover" @click="open = !open" />
    <template #content>
      <p style="margin:0">
        Click outside or press Esc to close.
      </p>
    </template>
  </MPopover>
</template>
