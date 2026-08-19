export interface InplaceProps {
  modelValue?: boolean
  disabled?: boolean
}

export interface InplaceEmits {
  (event: 'update:modelValue', value: boolean): void
}
