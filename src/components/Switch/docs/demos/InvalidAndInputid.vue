<script setup lang="ts">
import { MSwitch } from 'morya-ui'
import { ref } from 'vue'

const dark = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <MSwitch v-model="dark" input-id="dark-mode" label="Dark mode" />
    <MSwitch :model-value="false" invalid label="Must be enabled" />
  </div>
</template>
