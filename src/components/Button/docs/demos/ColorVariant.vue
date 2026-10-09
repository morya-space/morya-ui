<script setup lang="ts">
import { MButton, MFlex, MSpace } from 'morya-ui'
</script>

<template>
  <MFlex vertical gap="medium">
    <MSpace wrap>
      <MButton color="primary" variant="solid" label="Solid" />
      <MButton color="primary" variant="outlined" label="Outlined" />
      <MButton color="primary" variant="dashed" label="Dashed" />
      <MButton color="primary" variant="filled" label="Filled" />
      <MButton color="primary" variant="text" label="Text" />
      <MButton color="primary" variant="link" label="Link" />
    </MSpace>
    <MSpace wrap>
      <MButton color="danger" variant="solid" label="Danger" />
      <MButton color="success" variant="solid" label="Success" />
      <MButton color="info" variant="filled" label="Info" />
      <MButton color="warning" variant="outlined" label="Warning" />
      <MButton color="contrast" variant="solid" label="Contrast" />
    </MSpace>
  </MFlex>
</template>
