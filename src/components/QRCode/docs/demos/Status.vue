<script setup lang="ts">
import { ref } from 'vue'
import { MQRCode } from 'morya-ui'

const status = ref<'active' | 'expired'>('expired')

function onRefresh() {
  status.value = 'active'
}
</script>

<template>
  <MQRCode
    value="refresh-me"
    :status="status"
    @refresh="onRefresh"
  />
</template>
