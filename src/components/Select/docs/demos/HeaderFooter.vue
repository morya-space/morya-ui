<script setup lang="ts">
import { MButton, MSelect } from 'morya-ui'
import { ref } from 'vue'

const value = ref<string | number | undefined>()
const options = [
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'dev' },
  { label: 'Marketing', value: 'mkt' },
]
</script>

<template>
  <MSelect v-model="value" label="Team" :options="options" placeholder="Choose a team">
    <template #header>
      <span style="color: var(--m-color-text-muted); font-size: var(--m-font-size-xs)">
        Teams you belong to
      </span>
    </template>
    <template #footer>
      <MButton label="Manage teams" variant="text" size="sm" />
    </template>
  </MSelect>
</template>
