<script setup lang="ts">
import { MFileUpload } from 'morya-ui'
</script>

<template>
  <MFileUpload multiple accept="image/*" list-type="picture-card" :limit="4" />
</template>
