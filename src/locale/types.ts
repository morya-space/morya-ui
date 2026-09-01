export type WiLocaleName = 'zh-CN' | 'en-US'

/** Shared UI copy. Partial overrides merge onto the active language pack. */
export interface WiLocaleConfig {
  name?: WiLocaleName | (string & {})
  accept?: string
  reject?: string
  confirm?: string
  emptyMessage?: string
  emptyOptions?: string
  searchPlaceholder?: string
  datePickerPlaceholder?: string
  selectPlaceholder?: string
  clear?: string
  close?: string
  loading?: string
  required?: string
  expand?: string
  collapse?: string
  prevPage?: string
  nextPage?: string
  pagination?: string
  page?: string
  prevMonth?: string
  nextMonth?: string
  weekdays?: string[]
  monthNames?: string[]
  monthYear?: string
  chooseFile?: string
  dropFileHere?: string
  clickToUpload?: string
  previewFile?: string
  removeFile?: string
  retryUpload?: string
  uploadFile?: string
  addFile?: string
  uploadFailed?: string
  showPassword?: string
  hidePassword?: string
  passwordWeak?: string
  passwordMedium?: string
  passwordStrong?: string
  passwordStrength?: string
  prevImage?: string
  nextImage?: string
  thumbnails?: string
  moveUp?: string
  moveDown?: string
  dragToReorder?: string
  moveToTarget?: string
  moveAllToTarget?: string
  moveToSource?: string
  moveAllToSource?: string
  sourceHeader?: string
  targetHeader?: string
  moreActions?: string
  backToTop?: string
  clearRating?: string
  decrease?: string
  increase?: string
  selectColor?: string
  clearInput?: string
  remove?: string
  removeTag?: string
  addTag?: string
  createOption?: string
  moreTags?: string
  filterOptions?: string
  showSuggestions?: string
  commandPalette?: string
  searchCommands?: string
  terminal?: string
  commandInput?: string
  breadcrumb?: string
  sidebar?: string
  menubar?: string
  selectOption?: string
  maximize?: string
  restore?: string
  selectAllPage?: string
  resizeVertical?: string
  resizeHorizontal?: string
  speedDial?: string
  clearDate?: string
  datePicker?: string
  rangeStart?: string
  rangeEnd?: string
  sliderControl?: string
  prev?: string
  next?: string
  noMatch?: string
  filterAll?: string
  filterColumn?: string
  selectRow?: string
  closeNamed?: string
  otpDigit?: string
  star?: string
  openMenu?: string
  jumpToPage?: string
  pageClassifier?: string
  itemsPerPage?: string
  tabs?: string
  addTab?: string
  closeTab?: string
  dateRangePlaceholder?: string
  today?: string
}

export type WiLocaleMessages = Required<
  Omit<WiLocaleConfig, 'name' | 'weekdays' | 'monthNames'>
> & {
  name: string
  weekdays: string[]
  monthNames: string[]
}
