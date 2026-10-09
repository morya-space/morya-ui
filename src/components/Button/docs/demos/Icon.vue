<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap align="center">
    <MButton type="primary" icon="search" label="Search" />
    <MButton icon="search" icon-placement="end" label="Search" />
    <MButton type="primary" icon="plus" icon-only aria-label="Add" />
    <MButton shape="circle" icon="edit" aria-label="Edit" />
  </MFlex>
</template>
