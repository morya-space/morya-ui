<script setup lang="ts">
import type { TableHeader } from '../types'
import { computed, ref } from 'vue'
import { useMLocale } from '../../../locale'
import MButton from '../../Button/Button.vue'
import MCheckbox from '../../Checkbox/Checkbox.vue'
import MIcon from '../../Icon/Icon.vue'
import MPopover from '../../Popover/Popover.vue'

/**
 * Column visibility settings panel. Renders a gear button with a popover
 * listing every leaf column with a checkbox to show / hide it.
 *
 * Emits are intentionally granular so the parent can keep `hiddenColumns`
 * as the single source of truth.
 */
const props = defineProps<{
  /** Leaf columns (already flattened, without synthetic columns). */
  columns: TableHeader[]
  /** Currently hidden column keys (controlled). */
  hiddenKeys: ReadonlyArray<string>
}>()

const emit = defineEmits<{
  (event: 'toggle', key: string, visible: boolean): void
  (event: 'reset'): void
}>()

const locale = useMLocale()
const open = ref(false)

const hiddenSet = computed(() => new Set(props.hiddenKeys))

function isVisible(key: string) {
  return !hiddenSet.value.has(key)
}

function toggle(key: string, checked: boolean | unknown) {
  emit('toggle', key, Boolean(checked))
}

function onReset() {
  emit('reset')
}
</script>

<template>
  <span class="m-table__column-setting" @click.stop>
    <MPopover v-model="open" placement="bottom-end" trigger="click">
      <button
        type="button"
        class="m-table__filter-btn"
        :aria-label="locale.columnSettings"
        :aria-expanded="open"
      >
        <MIcon name="settings" />
      </button>
      <template #content>
        <div class="m-table__filter-panel" @click.stop>
          <p class="m-table__filter-title">
            {{ locale.columnSettingsTitle }}
          </p>
          <div
            class="m-table__filter-options"
            role="group"
            :aria-label="locale.columnSettingsTitle"
          >
            <label
              v-for="column in columns"
              :key="column.value"
              class="m-table__filter-option"
            >
              <MCheckbox
                :model-value="isVisible(column.value)"
                @update:model-value="(checked) => toggle(column.value, checked)"
              />
              <span>{{ column.text }}</span>
            </label>
          </div>
          <div class="m-table__filter-actions">
            <MButton size="sm" variant="text" @click="onReset">
              {{ locale.columnSettingsReset }}
            </MButton>
          </div>
        </div>
      </template>
    </MPopover>
  </span>
</template>
