<script setup lang="ts">
import type { TypographyDecorations } from './types'
import { computed, nextTick, ref, useSlots, watch } from 'vue'
import { useMLocale } from '../../locale'
import MIcon from '../Icon/Icon.vue'
import MTextarea from '../Textarea/Textarea.vue'
import { slotText, useTypographyBehavior } from './behavior'

defineOptions({ inheritAttrs: false, name: 'MTypographyContent' })

const props = withDefaults(defineProps<{
  /** Decoration props forwarded from the parent (Title / Text / Paragraph / Link). */
  decorations?: TypographyDecorations
  disabled?: boolean
}>(), {
  decorations: undefined,
  disabled: false,
})

const slots = useSlots()
const locale = useMLocale()

const behavior = useTypographyBehavior({
  props: () => ({ ...props.decorations, disabled: props.disabled }),
  text: () => slotText(slots.default?.()),
})

const editorRef = ref<InstanceType<typeof MTextarea> | null>(null)

watch(
  () => behavior.editing.value,
  async (editing) => {
    if (!editing) return
    await nextTick()
    editorRef.value?.focus()
  },
)

const contentClass = computed(() => ({
  'm-typography__content': true,
  'm-typography--ellipsis': Boolean(behavior.ellipsis.value) && !behavior.isMultiline.value,
  'm-typography--ellipsis-multiline': behavior.isMultiline.value,
  'm-typography--ellipsis-expanded': behavior.expanded.value,
}))

const showSuffix = computed(
  () => Boolean(behavior.ellipsis.value?.suffix) && behavior.isClamped.value,
)

const editorAutosize = computed(() => behavior.editable.value?.autoSize)
const editorStatus = computed(() => (behavior.error.value ? 'error' : undefined))
</script>

<template>
  <MTextarea
    v-if="behavior.editing.value"
    ref="editorRef"
    v-model="behavior.draft.value"
    class="m-typography__editor"
    :autosize="editorAutosize"
    :maxlength="behavior.editable.value?.maxLength"
    :status="editorStatus"
    :rows="2"
    @blur="behavior.commitEdit()"
    @keydown.enter.exact.prevent="behavior.commitEdit()"
    @keydown.esc="behavior.cancelEdit()"
  />

  <template v-else>
    <span
      class="m-typography__content"
      :class="contentClass"
      :style="behavior.contentStyle.value"
      :title="behavior.ellipsis.value?.tooltip"
    >
      <slot />
    </span>

    <span v-if="showSuffix" class="m-typography__ellipsis-suffix" aria-hidden="true">
      {{ behavior.ellipsis.value?.suffix }}
    </span>

    <button
      v-if="behavior.showExpandAction.value"
      type="button"
      class="m-typography__action m-typography__expand"
      :aria-expanded="behavior.expanded.value"
      @click="behavior.toggleExpand()"
    >
      {{ behavior.expanded.value ? (locale.collapse ?? 'Collapse') : (locale.expand ?? 'Expand') }}
    </button>

    <button
      v-if="behavior.copyable.value"
      type="button"
      class="m-typography__action m-typography__copy"
      :title="behavior.copyLabel.value"
      :aria-label="behavior.copyLabel.value"
      @click="behavior.copy()"
    >
      <MIcon :name="behavior.copied.value ? 'check' : 'copy'" />
    </button>

    <button
      v-if="behavior.editable.value && !props.disabled"
      type="button"
      class="m-typography__action m-typography__edit"
      :title="behavior.editLabel.value"
      :aria-label="behavior.editLabel.value"
      @click="behavior.startEdit()"
    >
      <MIcon name="edit" />
    </button>
  </template>
</template>
