<script setup lang="ts">
import { MIcon, MIconField, MInput } from 'morya-ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div style="display:grid;gap:1rem;width:min(24rem,100%)">
    <MIconField>
      <template #icon>
        <MIcon name="info" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Search" fluid />
    </MIconField>
    <MIconField icon-position="right">
      <template #icon>
        <MIcon name="check" size="sm" />
      </template>
      <MInput v-model="value" placeholder="Verified" fluid />
    </MIconField>
  </div>
</template>
