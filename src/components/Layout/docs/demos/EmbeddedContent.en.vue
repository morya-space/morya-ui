<script setup lang="ts">
import { MLayout, MLayoutContent, MLayoutHeader } from 'morya-ui'
</script>

<template>
  <MLayout style="height:12rem;border:1px solid var(--m-color-border);border-radius:var(--m-radius-md);overflow:hidden">
    <MLayoutHeader bordered style="padding:0.75rem 1rem">
      Settings
    </MLayoutHeader>
    <MLayoutContent embedded content-style="padding:1rem">
      Nested forms / lists go here.
    </MLayoutContent>
  </MLayout>
</template>
