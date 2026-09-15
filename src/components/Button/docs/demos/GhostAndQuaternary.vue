<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Ghost" ghost />
    <MButton label="Ghost Danger" ghost severity="danger" />
    <MButton label="Quaternary" quaternary />
    <MButton label="Custom" color="#e11d48" />
  </div>
</template>
