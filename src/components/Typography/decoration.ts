import type { TypographyDecorations, TypographyType } from './types'

/** Shared BEM modifiers for Title / Text / Paragraph decorations. */
export function typographyDecorationClass(
  props: TypographyDecorations & { disabled?: boolean },
): Record<string, boolean> {
  return {
    'm-typography--secondary': props.type === 'secondary',
    'm-typography--success': props.type === 'success',
    'm-typography--warning': props.type === 'warning',
    'm-typography--danger': props.type === 'danger',
    'm-typography--code': Boolean(props.code),
    'm-typography--delete': Boolean(props.delete),
    'm-typography--mark': Boolean(props.mark),
    'm-typography--underline': Boolean(props.underline),
    'm-typography--strong': Boolean(props.strong),
    'm-typography--italic': Boolean(props.italic),
    'm-typography--ellipsis': Boolean(props.ellipsis),
    'm-typography--disabled': Boolean(props.disabled),
  }
}

export function typographyTypeClass(type?: TypographyType): Record<string, boolean> {
  return {
    'm-typography--secondary': type === 'secondary',
    'm-typography--success': type === 'success',
    'm-typography--warning': type === 'warning',
    'm-typography--danger': type === 'danger',
  }
}
