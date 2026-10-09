<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton type="primary" ripple label="Ripple" />
    <MButton type="primary" press label="Press" />
    <MButton type="primary" ripple press label="Both" />
  </MFlex>
</template>
