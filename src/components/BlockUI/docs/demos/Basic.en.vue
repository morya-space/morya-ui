<script setup lang="ts">
import { MBlockUI, MButton } from 'morya-ui'
import { ref } from 'vue'

const blocked = ref(false)
</script>

<template>
  <MButton :label="blocked ? 'Unblock' : 'Block'" @click="blocked = !blocked" />
  <MBlockUI :blocked="blocked" style="margin-top: 1rem">
    <p>Panel content</p>
  </MBlockUI>
</template>
