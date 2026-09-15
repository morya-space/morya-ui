<script setup lang="ts">
import { MTerminal } from 'morya-ui'
import { ref } from 'vue'

const last = ref('')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:0.5rem">
    <MTerminal welcome-message="Morya UI Terminal" @command="last = $event" />
    <div v-if="last">
      Last command: {{ last }}
    </div>
  </div>
</template>
