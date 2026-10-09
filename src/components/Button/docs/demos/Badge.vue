<script setup lang="ts">
import { MButton, MFlex } from 'morya-ui'
</script>

<template>
  <MFlex gap="small" wrap align="center">
    <MButton type="primary" icon="bell" label="Inbox" badge="3" />
    <MButton label="Messages" badge="12" badge-color="danger" />
    <MButton icon="mail" icon-only badge="9" aria-label="Mail" />
  </MFlex>
</template>
