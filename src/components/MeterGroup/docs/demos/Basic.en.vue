<script setup lang="ts">
import { MMeterGroup } from 'morya-ui'

const value = [
  { label: 'Apps', value: 45, color: '#2563eb' },
  { label: 'Media', value: 25, color: '#16a34a' },
  { label: 'Other', value: 15, color: '#ea580c' },
]
</script>

<template>
  <MMeterGroup :value="value" :max="100" />
</template>
