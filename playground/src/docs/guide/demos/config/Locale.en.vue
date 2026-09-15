<script setup lang="ts">
import { MButton, MConfigProvider, MConfirmDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
]
</script>

<template>
  <MConfigProvider
    :locale="{ selectPlaceholder: 'Pick a city', accept: 'OK', reject: 'Not now' }"
  >
    <div class="flex flex-wrap gap-3 items-center">
      <MSelect v-model="city" :options="options" class="w-48" />
      <MButton label="Open confirm" @click="confirmOpen = true" />
      <MConfirmDialog
        v-model="confirmOpen"
        header="Confirm"
        message="Button labels come from locale.accept / reject."
      />
    </div>
  </MConfigProvider>
</template>
