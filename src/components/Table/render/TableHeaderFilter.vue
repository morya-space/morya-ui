<script setup lang="ts">
import type { TableColumnFilter } from '../types'
import { computed, ref, watch } from 'vue'
import { useMLocale } from '../../../locale'
import MButton from '../../Button/Button.vue'
import MCheckbox from '../../Checkbox/Checkbox.vue'
import MIcon from '../../Icon/Icon.vue'
import MInput from '../../Input/Input.vue'
import MPopover from '../../Popover/Popover.vue'
import { columnFilterLabel } from '../core/normalize'

const props = defineProps<{
  columnKey: string
  label: string
  filters?: TableColumnFilter[]
  modelValue?: unknown
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown): void
  (event: 'apply', value: unknown): void
  (event: 'clear'): void
}>()

const locale = useMLocale()
const open = ref(false)
const draftText = ref('')
const draftValues = ref<unknown[]>([])

const hasOptions = computed(() => Boolean(props.filters?.length))
const isActive = computed(() => {
  const value = props.modelValue
  if (value == null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  return true
})

const filterAria = computed(() =>
  locale.value.filterColumn.replace('{label}', props.label),
)

watch(
  () => [open.value, props.modelValue] as const,
  ([isOpen]) => {
    if (!isOpen) return
    if (hasOptions.value) {
      draftValues.value = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : props.modelValue != null && props.modelValue !== ''
          ? [props.modelValue]
          : []
    } else {
      draftText.value = props.modelValue == null ? '' : String(props.modelValue)
    }
  },
)

function toggleOption(value: unknown, checked: boolean | unknown) {
  const next = [...draftValues.value]
  const index = next.findIndex((entry) => entry === value || String(entry) === String(value))
  if (checked && index === -1) next.push(value)
  if (!checked && index !== -1) next.splice(index, 1)
  draftValues.value = next
}

function isOptionChecked(value: unknown) {
  return draftValues.value.some((entry) => entry === value || String(entry) === String(value))
}

function apply() {
  const next = hasOptions.value
    ? (draftValues.value.length ? [...draftValues.value] : null)
    : (draftText.value.trim() ? draftText.value.trim() : null)
  emit('update:modelValue', next)
  emit('apply', next)
  open.value = false
}

function resetDraft() {
  draftText.value = ''
  draftValues.value = []
}
</script>

<template>
  <span class="m-table__filter" @click.stop>
    <MPopover v-model="open" placement="bottom-start" trigger="click">
      <button
        type="button"
        class="m-table__filter-btn"
        :class="{ 'm-table__filter-btn--active': isActive }"
        :aria-label="filterAria"
        :aria-expanded="open"
      >
        <MIcon name="filter" />
      </button>
      <template #content>
        <div class="m-table__filter-panel" @click.stop>
          <p class="m-table__filter-title">
            {{ filterAria }}
          </p>
          <div v-if="hasOptions" class="m-table__filter-options" role="group" :aria-label="filterAria">
            <label
              v-for="(option, index) in filters"
              :key="index"
              class="m-table__filter-option"
            >
              <MCheckbox
                :model-value="isOptionChecked(option.value)"
                @update:model-value="(checked) => toggleOption(option.value, checked)"
              />
              <span>{{ columnFilterLabel(option) }}</span>
            </label>
          </div>
          <MInput
            v-else
            v-model="draftText"
            size="sm"
            :placeholder="locale.searchPlaceholder"
            @keydown.enter.prevent="apply"
          />
          <div class="m-table__filter-actions">
            <MButton size="sm" variant="text" @click="resetDraft">
              {{ locale.clear }}
            </MButton>
            <MButton size="sm" @click="apply" type="primary">
              {{ locale.confirm }}
            </MButton>
          </div>
        </div>
      </template>
    </MPopover>
  </span>
</template>
