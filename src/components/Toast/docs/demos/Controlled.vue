<script setup lang="ts">
import type { ToastMessage } from 'morya-ui'
import { MButton, MToast } from 'morya-ui'
import { ref } from 'vue'

const messages = ref<ToastMessage[]>([])
let seq = 0

function push(type: ToastMessage['type'], summary: string, detail?: string) {
  messages.value = [
    ...messages.value,
    { id: `toast-${++seq}`, summary, detail, type, life: 0 },
  ]
}

function onClose(message: ToastMessage) {
  messages.value = messages.value.filter((item) => item.id !== message.id)
}
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Success" @click="push('success', 'Saved', 'Your changes are live.')" color="success" variant="solid"/>
    <MButton label="Info" @click="push('info', 'Tip', 'Something to know.')" color="info" variant="solid"/>
  </div>
  <MToast :messages="messages" position="top-right" @close="onClose" />
</template>
