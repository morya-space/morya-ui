<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton type="primary" label="Primary" />
    <MButton label="Default" />
    <MButton type="dashed" label="Dashed" />
    <MButton type="text" label="Text" />
    <MButton type="link" label="Link" />
  </MFlex>
</template>
