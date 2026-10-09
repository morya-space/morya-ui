<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton type="primary" danger label="Primary" />
    <MButton danger label="Default" />
    <MButton type="dashed" danger label="Dashed" />
    <MButton type="text" danger label="Text" />
    <MButton type="link" danger label="Link" />
  </MFlex>
</template>
