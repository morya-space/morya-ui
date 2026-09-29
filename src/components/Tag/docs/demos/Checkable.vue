<script setup lang="ts">
import { ref } from 'vue'
import { MTag } from 'morya-ui'

const movies = ref(false)
const books = ref(true)
const music = ref(false)
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <MTag v-model:checked="movies" checkable value="Movies" />
    <MTag v-model:checked="books" checkable value="Books" />
    <MTag v-model:checked="music" checkable value="Music" />
  </div>
</template>
