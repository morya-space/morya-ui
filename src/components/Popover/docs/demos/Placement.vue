<script setup lang="ts">
import { MButton, MPopover } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div style="display:flex;justify-content:center;padding:2rem">
    <MPopover v-model="open" placement="bottom-start">
      <MButton label="bottom-start" severity="secondary" @click="open = !open" />
      <template #content>
        <p style="margin:0">
          Aligned to the start of the trigger.
        </p>
      </template>
    </MPopover>
  </div>
</template>
