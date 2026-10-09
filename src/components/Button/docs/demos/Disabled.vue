<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton type="primary" label="Primary" disabled />
    <MButton label="Default" disabled />
    <MButton type="dashed" label="Dashed" disabled/>
    <MButton type="text" label="Text" disabled/>
    <MButton type="link" label="Link" disabled/>
    <MButton danger type="primary" label="Danger" disabled />
  </MFlex>
</template>
