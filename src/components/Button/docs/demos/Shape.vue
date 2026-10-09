<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap align="center">
    <MButton type="primary" label="Default" />
    <MButton type="primary" shape="round" label="Round" />
    <MButton type="primary" shape="circle" icon="search" aria-label="Search" />
    <MButton type="primary" shape="square" icon="plus" aria-label="Add" />
  </MFlex>
</template>
