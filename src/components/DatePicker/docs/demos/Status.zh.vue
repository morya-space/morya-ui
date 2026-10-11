<script setup lang="ts">
import { MDatePicker } from 'morya-ui'
import { ref } from 'vue'

const warning = ref<string | null>('2024-06-15')
const error = ref<string | null>('2024-06-20')
</script>

<template>
  <div style="display: grid; gap: 12px">
    <MDatePicker v-model="warning" label="Warning 状态" status="warning" help-text="这是一个温馨提示" />
    <MDatePicker v-model="error" label="Error 状态" status="error" help-text="字段存在错误" />
  </div>
</template>
