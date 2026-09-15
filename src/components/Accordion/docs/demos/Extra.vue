<script setup lang="ts">
import { MAccordion, MButton } from 'morya-ui'
import { ref } from 'vue'

const active = ref('a')
const tabs = [
  { value: 'a', header: 'Section A' },
]
</script>

<template>
  <MAccordion v-model="active" :tabs="tabs">
    <template #extra="{ tab }">
      <MButton :label="tab.header" size="small" text />
    </template>
    <template #a>
      <p style="margin:0">
        Content.
      </p>
    </template>
  </MAccordion>
</template>
