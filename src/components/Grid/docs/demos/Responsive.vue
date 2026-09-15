<script setup lang="ts">
import { MGrid, MGridItem } from 'morya-ui'
</script>

<template>
  <MGrid cols="2 s:3 m:4" :x-gap="12" :y-gap="12" item-responsive>
    <MGridItem v-for="n in 4" :key="n" span="1 m:2">
      <div style="padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        {{ n }}
      </div>
    </MGridItem>
  </MGrid>
</template>
