<script setup lang="ts">
import { useMLocale } from '../../locale'

const locale = useMLocale()
</script>

<template>
  <div class="m-table__loading-line" role="status" :aria-label="locale.loading" />
</template>
