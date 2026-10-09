<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="small" style="max-width: 20rem">
    <MButton type="primary" block label="Primary Block" />
    <MButton block label="Default Block" />
    <MButton type="dashed" block label="Dashed Block" />
  </MFlex>
</template>
