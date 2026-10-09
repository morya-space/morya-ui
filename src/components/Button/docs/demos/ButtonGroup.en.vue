<script setup lang="ts">
import { MButton, MButtonGroup, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MButtonGroup aria-label="Row actions">
      <MButton label="Edit" />
      <MButton label="Share" />
      <MButton danger label="Delete" />
    </MButtonGroup>
    <MButtonGroup block aria-label="Form actions">
      <MButton label="Cancel" />
      <MButton type="primary" label="Confirm" />
    </MButtonGroup>
  </MFlex>
</template>
