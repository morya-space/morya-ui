<script setup lang="ts">
import { MButton, MConfigProvider, MInput, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <MConfigProvider size="small">
    <div class="flex flex-wrap gap-3 items-center">
      <MButton label="继承 small" />
      <MInput placeholder="继承 small" class="w-40" />
      <MSelect v-model="city" :options="options" placeholder="继承 small" class="w-40" />
      <MButton label="覆盖为 large" size="large" />
    </div>
  </MConfigProvider>
</template>
