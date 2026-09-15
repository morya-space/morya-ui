<script setup lang="ts">
import { MButton, MConfirmPopup } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const target = ref<HTMLElement | null>(null)

function ask(event: MouseEvent) {
  target.value = event.currentTarget as HTMLElement
  open.value = true
}
</script>

<template>
  <MButton label="Delete" severity="danger" @click="ask" />
  <MConfirmPopup v-model="open" :target="target" message="Delete this item?" icon="info" placement="top" />
</template>
