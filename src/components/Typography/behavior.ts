import type { VNode } from 'vue'
import type {
  TypographyCopyable,
  TypographyCopyableConfig,
  TypographyDecorations,
  TypographyEditable,
  TypographyEditableConfig,
  TypographyEllipsis,
  TypographyEllipsisConfig,
} from './types'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useMLocale } from '../../locale'
import { flattenVNodes } from '../../shared/vnode'

/** Normalized ellipsis settings. `null` when ellipsis is off. */
export interface ResolvedEllipsis {
  rows: number
  expandable: boolean
  tooltip?: string
  suffix?: string
}

export function resolveEllipsis(ellipsis?: TypographyEllipsis): ResolvedEllipsis | null {
  if (!ellipsis) return null
  if (ellipsis === true) return { rows: 1, expandable: false }

  const config = ellipsis as TypographyEllipsisConfig
  return {
    rows: config.rows && config.rows > 0 ? Math.floor(config.rows) : 1,
    expandable: Boolean(config.expandable),
    tooltip: config.tooltip,
    suffix: config.suffix,
  }
}

export function resolveCopyable(copyable?: TypographyCopyable): TypographyCopyableConfig | null {
  if (!copyable) return null
  return copyable === true ? {} : copyable
}

export function resolveEditable(editable?: TypographyEditable): TypographyEditableConfig | null {
  if (!editable) return null
  return editable === true ? {} : editable
}

/** Collect the plain-text content of a slot (comments and blanks dropped). */
export function slotText(nodes: VNode[] | undefined): string {
  return flattenVNodes(nodes)
    .map(node => (typeof node.children === 'string' ? node.children : ''))
    .join('')
    .trim()
}

/** Copy through the async clipboard API, falling back to a hidden textarea. */
async function writeClipboard(value: string): Promise<void> {
  const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined
  if (clipboard?.writeText) {
    await clipboard.writeText(value)
    return
  }
  if (typeof document === 'undefined') return

  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand?.('copy')
  document.body.removeChild(area)
}

export interface UseTypographyBehaviorOptions {
  /** Reactive accessor for the decoration props. */
  props: () => TypographyDecorations & { disabled?: boolean }
  /** Current rendered text (used as the copy source and the edit draft seed). */
  text: () => string
}

/** Shared copy / edit / ellipsis behaviour for Title / Text / Paragraph / Link. */
export function useTypographyBehavior(options: UseTypographyBehaviorOptions) {
  const locale = useMLocale()

  const ellipsis = computed(() => resolveEllipsis(options.props().ellipsis))
  const copyable = computed(() => resolveCopyable(options.props().copyable))
  const editable = computed(() => resolveEditable(options.props().editable))

  const expanded = ref(false)
  const copied = ref(false)
  const editing = ref(false)
  const draft = ref('')
  const error = ref<string | null>(null)

  let copyTimer: ReturnType<typeof setTimeout> | null = null

  // Seed the initial editing state from the config.
  watch(
    editable,
    (config) => {
      if (config?.editing && !editing.value) {
        draft.value = options.text()
        editing.value = true
      }
    },
    { immediate: true },
  )

  const rowCount = computed(() => ellipsis.value?.rows ?? 1)
  const isMultiline = computed(() => Boolean(ellipsis.value) && rowCount.value > 1)
  /** True while the text is visually clamped (multi-line, not expanded). */
  const isClamped = computed(() => isMultiline.value && !expanded.value)

  const contentStyle = computed<Record<string, string> | undefined>(() => {
    if (!isClamped.value) return undefined
    // `-webkit-line-clamp` cannot be applied through an object style binding,
    // so the row count is passed as a custom property the stylesheet consumes.
    return { '--m-typography-rows': String(rowCount.value) }
  })

  const showExpandAction = computed(
    () => Boolean(ellipsis.value?.expandable) && isMultiline.value,
  )

  const copyLabel = computed(() => {
    const labels = copyable.value?.tooltips
    if (copied.value) return labels?.[1] ?? locale.value.copied ?? 'Copied'
    return labels?.[0] ?? locale.value.copy ?? 'Copy'
  })

  const editLabel = computed(() => editable.value?.tooltip ?? locale.value.edit ?? 'Edit')
  const cancelEditLabel = computed(() => locale.value.cancelEdit ?? 'Cancel edit')

  function toggleExpand() {
    expanded.value = !expanded.value
  }

  async function copy() {
    const config = copyable.value
    if (!config) return

    const raw = config.text ?? options.text()
    const value = config.format ? config.format(raw) : raw

    try {
      await writeClipboard(value)
      copied.value = true
      config.onCopy?.(value)

      if (copyTimer) clearTimeout(copyTimer)
      copyTimer = setTimeout(() => {
        copied.value = false
      }, 1500)
    }
    catch {
      copied.value = false
    }
  }

  function startEdit() {
    const config = editable.value
    if (!config || options.props().disabled) return
    draft.value = options.text()
    error.value = null
    editing.value = true
  }

  function commitEdit() {
    const config = editable.value
    if (!config || !editing.value) return

    const next = draft.value
    const result = config.onChange?.(next)

    if (result === false) return
    if (typeof result === 'string') {
      error.value = result
      return
    }

    error.value = null
    editing.value = false
  }

  function cancelEdit() {
    editing.value = false
    error.value = null
  }

  onBeforeUnmount(() => {
    if (copyTimer) clearTimeout(copyTimer)
  })

  return {
    ellipsis,
    copyable,
    editable,
    expanded,
    copied,
    editing,
    draft,
    error,
    rowCount,
    isMultiline,
    isClamped,
    contentStyle,
    showExpandAction,
    copyLabel,
    editLabel,
    cancelEditLabel,
    toggleExpand,
    copy,
    startEdit,
    commitEdit,
    cancelEdit,
  }
}
