<script setup lang="ts">
import { MButton, MDialog } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const position = ref<'center' | 'top' | 'topright' | 'bottomleft'>('center')

function openAt(next: 'center' | 'top' | 'topright' | 'bottomleft') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Center" size="small" @click="openAt('center')" />
    <MButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <MButton label="Top Right" size="small" @click="openAt('topright')" />
    <MButton label="Bottom Left" size="small" severity="secondary" @click="openAt('bottomleft')" />
    <MDialog v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">
        Dialog can dock to edges and corners.
      </p>
    </MDialog>
  </div>
</template>
