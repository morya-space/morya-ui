<script setup lang="ts">
import { MButton } from 'morya-ui'
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MButton icon="check" label="Save" />
    <MButton icon="search" label="Search" icon-pos="right" severity="secondary" />
    <MButton icon="plus" icon-only rounded aria-label="Add" />
    <MButton icon="trash" icon-only rounded outlined severity="danger" aria-label="Delete" />
    <MButton label="Messages" badge="2" badge-severity="danger" severity="secondary" />
  </div>
</template>
