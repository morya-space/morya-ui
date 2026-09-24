<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton label="Text" text />
    <MButton label="Text Danger" text severity="danger" />
    <MButton label="Link" link />
    <MButton label="Link No Underline" link :underline="false" />
    <MButton label="Link Secondary" link severity="secondary" />
  </div>
</template>
