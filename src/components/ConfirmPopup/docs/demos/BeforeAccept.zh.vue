<script setup lang="ts">
import { MButton, MConfirmPopup } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}

async function beforeAccept() {
  return window.confirm('再次确认？')
}
</script>

<template>
  <MButton label="带拦截" @click="ask" />
  <MConfirmPopup v-model="open" :target="target" message="继续？" :before-accept="beforeAccept" />
</template>
