<script setup lang="ts">
import { MButton, MInplace, MInput } from 'morya-ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('Click to edit')
</script>

<template>
  <MInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <MInput v-model="text" />
        <MButton label="Done" size="small" @click="close" />
      </div>
    </template>
  </MInplace>
</template>
