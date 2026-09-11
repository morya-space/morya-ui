/** Attribute bag for a single DOM part (class/style/events/data-* / native attrs). */
export type PassThroughPart = Record<string, unknown>

/** Generic pass-through map keyed by component DOM part name. */
export type PassThroughOptions = Partial<Record<string, PassThroughPart>>

/** Field components: root field wrapper + native control. */
export type FieldPassThrough = Partial<Record<'root' | 'label' | 'control' | 'input', PassThroughPart>>

/** Label-root controls: interactive root wraps a hidden native input. */
export type ControlPassThrough = Partial<Record<'root' | 'input', PassThroughPart>>

/** Single-root containers and layout primitives. */
export type RootPassThrough = Pick<ControlPassThrough, 'root'>
