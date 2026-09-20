<script setup lang="ts">
import { MButton, useLoading } from 'morya-ui'
import { ref } from 'vue'

const panel = ref<HTMLElement>()
const { open } = useLoading()

function openRegion() {
  const instance = open({
    target: panel.value,
    text: 'Loading',
    effect: 'wave',
  })
  window.setTimeout(() => instance.close(), 1600)
}

function openFullscreen() {
  const instance = open({
    text: 'Submitting',
    effect: 'aurora',
    lock: true,
  })
  window.setTimeout(() => instance.close(), 1600)
}
</script>

<template>
  <div class="grid gap-4">
    <div
      ref="panel"
      class="min-h-32 rounded-md border border-solid border-[var(--m-color-border)] p-4"
    >
      Region covered by the service
    </div>
    <div class="flex flex-wrap gap-3">
      <MButton label="Cover region" severity="secondary" @click="openRegion" />
      <MButton label="Fullscreen" @click="openFullscreen" />
    </div>
  </div>
</template>
