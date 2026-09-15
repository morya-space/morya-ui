<script setup lang="ts">
import { MButton, MDrawer } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <div>
    <MButton label="Open Drawer" @click="open = true" />
    <MDrawer v-model="open" header="Navigation">
      <p style="margin:0">
        Drawer body content. Esc or mask click closes by default.
      </p>
    </MDrawer>
  </div>
</template>
