<script setup lang="ts">
import { MButton, MConfigProvider, MDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const visible = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider input-variant="filled" append-to="body">
    <div class="flex flex-wrap gap-3 items-center">
      <MSelect v-model="city" :options="options" placeholder="filled input" class="w-48" />
      <MButton label="Open dialog" @click="visible = true" />
    </div>
    <MDialog v-model="visible" title="Inherits appendTo" class="w-96">
      <p style="margin:0">
        Overlay mount target is provided by ConfigProvider.
      </p>
    </MDialog>
  </MConfigProvider>
</template>
