<script setup lang="ts">
import { MToggleButton } from 'morya-ui'
import { ref } from 'vue'

const on = ref(false)
</script>

<template>
  <MToggleButton v-model="on" on-label="开启" off-label="关闭" />
</template>
