<script setup lang="ts">
import { WiButton, WiSpace } from '@well-insight/ui'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits<{
  search: []
  reset: []
}>()

const { t } = useLocale()
</script>

<template>
  <WiSpace wrap align="center">
    <slot />
    <WiButton @click="emit('search')">{{ t('查询', 'Search') }}</WiButton>
    <WiButton severity="secondary" @click="emit('reset')">{{ t('重置', 'Reset') }}</WiButton>
    <slot name="extra" />
  </WiSpace>
</template>
