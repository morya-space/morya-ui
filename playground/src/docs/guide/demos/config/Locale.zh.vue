<script setup lang="ts">
import { MButton, MConfigProvider, MConfirmDialog, MSelect } from 'morya-ui'
import { ref } from 'vue'

const city = ref<string | undefined>()
const confirmOpen = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
]
</script>

<template>
  <MConfigProvider
    :locale="{ selectPlaceholder: '挑一个城市', accept: '好的', reject: '再想想' }"
  >
    <div class="flex flex-wrap gap-3 items-center">
      <MSelect v-model="city" :options="options" class="w-48" />
      <MButton label="打开确认框" @click="confirmOpen = true" />
      <MConfirmDialog
        v-model="confirmOpen"
        header="确认操作"
        message="文案来自 locale.accept / reject。"
      />
    </div>
  </MConfigProvider>
</template>
