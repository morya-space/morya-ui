<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap align="center">
    <MButton type="primary" size="small" label="Small" />
    <MButton type="primary" size="medium" label="Medium" />
    <MButton type="primary" size="large" label="Large" />
    <MButton type="primary" size="small" icon="search" icon-only aria-label="Search small" />
    <MButton type="primary" size="large" icon="search" icon-only aria-label="Search large" />
  </MFlex>
</template>
