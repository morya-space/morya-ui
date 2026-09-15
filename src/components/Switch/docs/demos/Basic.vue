<script setup lang="ts">
import { MSwitch } from 'morya-ui'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <MSwitch v-model="enabled" label="Enable notifications" />
</template>
