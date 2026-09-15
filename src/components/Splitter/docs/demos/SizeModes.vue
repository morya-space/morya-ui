<script setup lang="ts">
import { MSplitter } from 'morya-ui'
import { ref } from 'vue'

const percent = ref(40)
const ratio = ref(0.3)
</script>

<template>
  <div class="grid gap-4">
    <MSplitter
      v-model:size="percent"
      style="min-height: 7rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          {{ percent }}%
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </MSplitter>
    <MSplitter
      v-model:size="ratio"
      :min="0.15"
      :max="0.85"
      style="min-height: 7rem; border: 1px solid var(--m-color-border); border-radius: var(--m-radius-md); overflow: hidden"
    >
      <template #panel1>
        <div style="padding:0.75rem">
          ratio {{ ratio }}
        </div>
      </template>
      <template #panel2>
        <div style="padding:0.75rem">
          rest
        </div>
      </template>
    </MSplitter>
  </div>
</template>
