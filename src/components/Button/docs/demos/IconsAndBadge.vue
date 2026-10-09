<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap>
    <MButton icon="search" label="Search" icon-placement="end" />
    <MButton type="primary" icon="check" label="Done" badge="3" />
    <MButton icon="trash" icon-only shape="round" variant="outlined" danger aria-label="Delete"/>
    <MButton label="Messages" badge="2" badge-color="danger" />
  </MFlex>
</template>
