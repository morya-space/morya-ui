<script setup lang="ts">
import { MButton, MDrawer } from 'morya-ui'
import { ref } from 'vue'

const open = ref(false)
const position = ref<'left' | 'right' | 'top' | 'bottom'>('right')

function openAt(next: 'left' | 'right' | 'top' | 'bottom') {
  position.value = next
  open.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <MButton label="Left" size="small" @click="openAt('left')" />
    <MButton label="Right" size="small" severity="secondary" @click="openAt('right')" />
    <MButton label="Top" size="small" severity="secondary" @click="openAt('top')" />
    <MButton label="Bottom" size="small" severity="secondary" @click="openAt('bottom')" />
    <MDrawer v-model="open" :header="`Position: ${position}`" :position="position">
      <p style="margin:0">
        Use <code>dismissable</code> to control mask dismiss.
      </p>
    </MDrawer>
  </div>
</template>
