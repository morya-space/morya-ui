<script setup lang="ts">
import { MSwitch } from 'morya-ui'
import { ref } from 'vue'

const on = ref(true)
</script>

<template>
  <MSwitch v-model="on" checked-text="开" unchecked-text="关" />
</template>
