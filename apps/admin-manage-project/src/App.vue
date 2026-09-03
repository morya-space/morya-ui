<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { WiConfigProvider } from '@well-insight/ui'
import { useLocale } from '@/composables/useLocale'

const { locale, density } = useLocale()
const configLocale = computed(() => locale.value)
</script>

<template>
  <WiConfigProvider :locale="configLocale" :density="density">
    <RouterView />
  </WiConfigProvider>
</template>
