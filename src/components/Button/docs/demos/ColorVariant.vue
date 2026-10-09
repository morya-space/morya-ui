<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MFlex gap="small" wrap>
      <MButton color="primary" variant="solid" label="Solid" />
      <MButton color="primary" variant="outlined" label="Outlined" />
      <MButton color="primary" variant="dashed" label="Dashed" />
      <MButton color="primary" variant="filled" label="Filled" />
      <MButton color="primary" variant="text" label="Text" />
      <MButton color="primary" variant="link" label="Link" />
    </MFlex>
    <MFlex gap="small" wrap>
      <MButton color="danger" variant="solid" label="Danger" />
      <MButton color="success" variant="solid" label="Success" />
      <MButton color="info" variant="filled" label="Info" />
      <MButton color="warning" variant="outlined" label="Warning" />
      <MButton color="contrast" variant="solid" label="Contrast" />
    </MFlex>
  </MFlex>
</template>
