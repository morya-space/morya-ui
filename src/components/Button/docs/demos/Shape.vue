<script setup lang="ts">
import { MButton, MSpace } from 'morya-ui'
</script>

<template>
  <MSpace wrap>
    <MButton label="Default" />
    <MButton
      shape="round"
      label="Round"
    />
    <MButton
      shape="circle"
      icon="search"
      icon-only
      aria-label="Search"
    />
    <MButton
      shape="square"
      icon="edit"
      icon-only
      aria-label="Edit"
    />
  </MSpace>
</template>
