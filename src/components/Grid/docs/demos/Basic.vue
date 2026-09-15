<script setup lang="ts">
import { MGrid, MGridItem } from 'morya-ui'
</script>

<template>
  <MGrid :cols="4" :x-gap="12" :y-gap="12">
    <MGridItem v-for="n in 4" :key="n" :span="1">
      <div style="padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        {{ n }}
      </div>
    </MGridItem>
  </MGrid>
</template>
