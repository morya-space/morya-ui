<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <MSpace wrap>
    <MButton label="Primary" />
    <MButton
      severity="secondary"
      label="Default"
    />
    <MButton
      variant="dashed"
      label="Dashed"
    />
    <MButton
      text
      label="Text"
    />
    <MButton
      link
      label="Link"
    />
    <MButton
      severity="danger"
      label="Danger"
    />
  </MSpace>
</template>
