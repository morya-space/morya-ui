<script setup lang="ts">
import { MButton, MInplace, MInput } from 'morya-ui'
import { ref } from 'vue'

const active = ref(false)
const text = ref('点击编辑')
</script>

<template>
  <MInplace v-model="active">
    <template #display>
      {{ text }}
    </template>
    <template #content="{ close }">
      <div style="display:flex;gap:8px">
        <MInput v-model="text" />
        <MButton label="完成" size="small" @click="close" />
      </div>
    </template>
  </MInplace>
</template>
