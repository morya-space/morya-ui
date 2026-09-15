<script setup lang="ts">
import { MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <MFileUpload mode="advanced" multiple @select="onSelect" />
    <div v-if="names.length">
      已选：{{ names.join(', ') }}
    </div>
  </div>
</template>
