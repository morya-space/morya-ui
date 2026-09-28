/** Internal synthetic column keys — never collide with user row fields. */
export const SYNTHETIC = {
  expand: '__m_expand',
  index: '__m_index',
  checkbox: '__m_checkbox',
  radio: '__m_radio',
} as const

export type SyntheticColumnKey = (typeof SYNTHETIC)[keyof typeof SYNTHETIC]

export function isSyntheticColumn(value: string): boolean {
  return (Object.values(SYNTHETIC) as string[]).includes(value)
}
