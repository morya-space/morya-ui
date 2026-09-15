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
  return window.confirm('Confirm again?')
}
</script>

<template>
  <MButton label="With guard" @click="ask" />
  <MConfirmPopup v-model="open" :target="target" message="Continue?" :before-accept="beforeAccept" />
</template>
