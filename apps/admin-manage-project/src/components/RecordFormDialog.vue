<script setup lang="ts">
import {
  WiButton,
  WiDialog,
  WiForm,
  WiSpace,
} from '@well-insight/ui'
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const open = defineModel<boolean>({ default: false })

const props = withDefaults(defineProps<{
  title: string
  submitting?: boolean
}>(), {
  submitting: false,
})

const emit = defineEmits<{
  submit: [payload: { valid: boolean }]
}>()

const { t } = useLocale()
const dialogTitle = computed(() => props.title)
</script>

<template>
  <WiDialog v-model="open" :header="dialogTitle" modal :style="{ width: 'min(32rem, 92vw)' }">
    <WiForm @submit="emit('submit', $event)">
      <slot />
      <footer class="record-form-dialog__footer">
        <WiSpace>
          <WiButton native-type="submit" :loading="submitting">
            {{ t('保存', 'Save') }}
          </WiButton>
          <WiButton severity="secondary" type="button" @click="open = false">
            {{ t('取消', 'Cancel') }}
          </WiButton>
        </WiSpace>
      </footer>
    </WiForm>
  </WiDialog>
</template>

<style scoped>
.record-form-dialog__footer {
  margin-top: var(--wi-space-4);
  padding-top: var(--wi-space-4);
  border-top: 1px solid var(--wi-color-border);
}
</style>
