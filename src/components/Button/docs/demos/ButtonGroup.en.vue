<script setup lang="ts">
import { MButton, MButtonGroup, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MButtonGroup aria-label="Align">
      <MButton label="Left" />
      <MButton label="Center" />
      <MButton label="Right" />
    </MButtonGroup>
    <MButtonGroup block aria-label="Block group">
      <MButton label="Cancel" />
      <MButton type="primary" label="Confirm" />
    </MButtonGroup>
  </MFlex>
</template>
