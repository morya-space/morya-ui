<script setup lang="ts">
import { MButton, MEmpty } from 'morya-ui'
</script>

<template>
  <MEmpty
    title="No courses yet"
    description="Create your first course so learners can find it in the catalog. You can also import from a template later."
    icon="book"
  >
    <template #extra>
      <MButton label="Create first course" />
      <MButton label="Import from template" severity="secondary" text />
    </template>
  </MEmpty>
</template>
