<script setup lang="ts">
import { MInput } from 'morya-ui'
import { ref } from 'vue'

const name = ref('')
function onEnter() {
  // submit
}
</script>

<template>
  <MInput
    v-model="name"
    class="signup-field"
    data-testid="user-name"
    placeholder="Your name"
    @keydown.enter="onEnter"
  />
</template>
