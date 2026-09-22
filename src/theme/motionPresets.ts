export type MotionPresetId = string

export type MotionTransitionRole =
  | 'dialog'
  | 'drawer'
  | 'popup'
  | 'toast'
  | 'tooltip'
  | 'overlay'

export interface MotionPresetDefinition {
  /** Vue `<Transition name>` — maps to `.{name}-enter-active` etc. */
  name: string
}

/** Built-in enter/exit presets. Keys are stable public IDs. */
export const builtinMotionPresets: Readonly<Record<string, MotionPresetDefinition>> = {
  fade: { name: 'm-fade' },
  'scale-fade': { name: 'm-scale-fade' },
  'slide-fade': { name: 'm-slide-fade' },
  zoom: { name: 'm-zoom' },
  /** Alias of dialog panel zoom (nested `.m-dialog-zoom` structure). */
  dialog: { name: 'm-dialog' },
  'slide-up': { name: 'm-slide-up' },
  'slide-down': { name: 'm-slide-down' },
  'slide-left': { name: 'm-slide-left' },
  'slide-right': { name: 'm-slide-right' },
  drawer: { name: 'm-drawer' },
  popover: { name: 'm-popover' },
  loading: { name: 'm-loading' },
  blockui: { name: 'm-blockui' },
  message: { name: 'm-message-slide' },
  none: { name: 'm-none' },
}

const customPresets = new Map<string, MotionPresetDefinition>()

export function registerMotionPreset(id: string, def: MotionPresetDefinition): void {
  if (!id) throw new Error('[morya-ui] registerMotionPreset: id is required')
  if (!def?.name) throw new Error(`[morya-ui] registerMotionPreset: name is required for "${id}"`)
  customPresets.set(id, { name: def.name })
}

export function unregisterMotionPreset(id: string): void {
  customPresets.delete(id)
}

/** Reset custom presets (tests). Built-ins are never cleared. */
export function clearCustomMotionPresets(): void {
  customPresets.clear()
}

export function listMotionPresets(): string[] {
  return [...new Set([...Object.keys(builtinMotionPresets), ...customPresets.keys()])]
}

export function resolveMotionPreset(id: MotionPresetId): MotionPresetDefinition {
  const custom = customPresets.get(id)
  if (custom) return custom
  const builtin = builtinMotionPresets[id]
  if (builtin) return builtin
  // Unregistered id: treat as CSS transition name (`foo` → `m-foo`, `m-foo` stays).
  return { name: id.startsWith('m-') ? id : `m-${id}` }
}

export interface ResolveMotionTransitionOptions {
  /** Component `transition` prop. `false` / `'none'` disables CSS transition. */
  local?: MotionPresetId | false
  /** From `componentDefaults[Component].transition`. */
  componentDefault?: MotionPresetId | false
  /** From `motion.transitions[role]`. */
  rolePreset?: MotionPresetId
  /** Component built-in when nothing else is set. */
  fallback: MotionPresetId
}

/**
 * Resolve Vue `<Transition name>`.
 * Returns `undefined` when motion should be disabled (`false` / `'none'`).
 */
export function resolveMotionTransition(options: ResolveMotionTransitionOptions): string | undefined {
  const presetId = pickPresetId(options)
  if (presetId === false || presetId === 'none') return undefined
  return resolveMotionPreset(presetId).name
}

function pickPresetId(options: ResolveMotionTransitionOptions): MotionPresetId | false {
  if (options.local !== undefined) return options.local
  if (options.componentDefault !== undefined) return options.componentDefault
  if (options.rolePreset !== undefined) return options.rolePreset
  return options.fallback
}
