<script setup lang="ts">
import { MGrid, MGridItem } from 'morya-ui'
</script>

<template>
  <MGrid :cols="6" :x-gap="12" :y-gap="12">
    <MGridItem :span="2">
      <div style="padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        span 2
      </div>
    </MGridItem>
    <MGridItem :span="2" :offset="1">
      <div style="padding:0.75rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md)">
        offset 1
      </div>
    </MGridItem>
  </MGrid>
</template>
