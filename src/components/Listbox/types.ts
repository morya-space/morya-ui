export type ListboxValue = string | number

export interface ListboxOption {
  label: string
  value: ListboxValue
  disabled?: boolean
}

export interface ListboxProps {
  modelValue?: ListboxValue | ListboxValue[]
  options: ListboxOption[]
  multiple?: boolean
  disabled?: boolean
  filter?: boolean
  listStyle?: string
}

export interface ListboxEmits {
  (event: 'update:modelValue', value: ListboxValue | ListboxValue[] | undefined): void
}
