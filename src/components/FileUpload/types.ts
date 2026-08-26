export type FileUploadMode = 'basic' | 'advanced'
export type FileUploadListType = 'text' | 'picture' | 'picture-card'
export type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail'

export interface FileUploadFile {
  uid: string
  name: string
  size?: number
  type?: string
  status: FileUploadStatus
  percentage?: number
  url?: string
  raw?: File
  response?: unknown
  error?: string
}

export interface FileUploadRequestOptions {
  action: string
  method: string
  file: File
  filename: string
  data: Record<string, string | Blob>
  headers: Record<string, string>
  withCredentials: boolean
  onProgress: (percent: number) => void
  onSuccess: (response: unknown) => void
  onError: (error: Error) => void
}

export interface FileUploadProps {
  mode?: FileUploadMode
  multiple?: boolean
  accept?: string
  disabled?: boolean
  chooseLabel?: string
  /** Enable drag-and-drop zone. */
  drag?: boolean
  /** Maximum number of files. Extra files emit `exceed`. */
  limit?: number
  /** Max file size in bytes. Oversized files are skipped. */
  maxSize?: number
  /** Select a folder (`webkitdirectory`). Implies multiple files. */
  directory?: boolean
  /** Show the file list. */
  showFileList?: boolean
  listType?: FileUploadListType
  /** Bound file list (`v-model:file-list`). */
  fileList?: FileUploadFile[]
  /** Upload URL. When set, files upload automatically unless `autoUpload` is false. */
  action?: string
  method?: string
  /** Form field name for the file. */
  name?: string
  headers?: Record<string, string>
  data?: Record<string, string | Blob> | (() => Record<string, string | Blob>)
  withCredentials?: boolean
  /** Upload as soon as files are selected. Requires `action` or `httpRequest`. */
  autoUpload?: boolean
  /** Custom uploader. Receives the same hooks as the default XHR request. */
  httpRequest?: (options: FileUploadRequestOptions) => void | Promise<unknown> | XMLHttpRequest
  beforeUpload?: (file: File, uploadFile: FileUploadFile) => boolean | Promise<boolean | void> | void
  beforeRemove?: (uploadFile: FileUploadFile, fileList: FileUploadFile[]) => boolean | Promise<boolean | void> | void
}

export interface FileUploadEmits {
  (event: 'select', files: File[]): void
  (event: 'exceed', files: File[]): void
  (event: 'update:fileList', files: FileUploadFile[]): void
  (event: 'change', file: FileUploadFile, fileList: FileUploadFile[]): void
  (event: 'remove', file: FileUploadFile): void
  (event: 'preview', file: FileUploadFile): void
  (event: 'progress', file: FileUploadFile, percent: number): void
  (event: 'success', file: FileUploadFile, response: unknown): void
  (event: 'error', file: FileUploadFile, error: Error): void
}

export interface FileUploadSlots {
  default?: () => unknown
  trigger?: () => unknown
  tip?: () => unknown
  file?: (props: { file: FileUploadFile }) => unknown
}

export interface FileUploadExpose {
  openPicker: () => void
  submit: () => void
  abort: (file?: FileUploadFile) => void
  clear: () => void
  clearFiles: () => void
}

export type FileUploadInstance = FileUploadExpose
