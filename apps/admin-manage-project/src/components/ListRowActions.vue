<script setup lang="ts">
import { ref } from 'vue'
import { WiButton, WiConfirmDialog, WiSpace } from '@well-insight/ui'
import { useLocale } from '@/composables/useLocale'

withDefaults(defineProps<{
  showEdit?: boolean
  showDelete?: boolean
  editLabel?: string
  deleteLabel?: string
}>(), {
  showEdit: true,
  showDelete: true,
  editLabel: undefined,
  deleteLabel: undefined,
})

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const deleteOpen = ref(false)

const { t } = useLocale()
</script>

<template>
  <WiSpace>
    <WiButton
      v-if="showEdit"
      size="small"
      severity="secondary"
      @click="emit('edit')"
    >
      {{ editLabel ?? t('编辑', 'Edit') }}
    </WiButton>
    <WiButton
      v-if="showDelete"
      size="small"
      severity="danger"
      @click="deleteOpen = true"
    >
      {{ deleteLabel ?? t('删除', 'Delete') }}
    </WiButton>
    <slot />
  </WiSpace>

  <WiConfirmDialog
    v-if="showDelete"
    v-model="deleteOpen"
    type="error"
    :header="t('确认删除', 'Confirm delete')"
    :message="t('删除后可在回收站恢复（如已启用软删除）。确定继续？', 'Deleted items can be restored from recycle bin. Continue?')"
    @accept="emit('delete')"
  />
</template>
