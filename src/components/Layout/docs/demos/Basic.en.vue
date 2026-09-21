<script setup lang="ts">
import { MLayout, MLayoutContent, MLayoutFooter, MLayoutHeader } from 'morya-ui'
</script>

<template>
  <MLayout style="height:16rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Header
    </MLayoutHeader>
    <MLayoutContent embedded style="padding:1rem;display:flex;align-items:center;justify-content:center">
      Content (fills remaining space)
    </MLayoutContent>
    <MLayoutFooter bordered style="padding:0.75rem 1rem">
      Footer
    </MLayoutFooter>
  </MLayout>
</template>
