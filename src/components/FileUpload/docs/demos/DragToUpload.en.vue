<script setup lang="ts">
import { MFileUpload } from 'morya-ui'
import { ref } from 'vue'

const names = ref<string[]>([])
function onSelect(files: File[]) {
  names.value = files.map((f) => f.name)
}
</script>

<template>
  <div class="flex flex-col gap-3 max-w-md">
    <MFileUpload drag multiple accept="image/*,.pdf" @select="onSelect">
      <template #tip>
        Images or PDF. Multiple files can be dropped at once.
      </template>
    </MFileUpload>
    <div v-if="names.length">
      Selected: {{ names.join(', ') }}
    </div>
  </div>
</template>
