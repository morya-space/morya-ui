export interface FieldsetProps {
  legend?: string
  toggleable?: boolean
  collapsed?: boolean
}

export interface FieldsetEmits {
  (event: 'update:collapsed', value: boolean): void
}
