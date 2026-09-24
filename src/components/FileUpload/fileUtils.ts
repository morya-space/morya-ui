import type { FileUploadFile } from './types'

/** Whether a File matches an HTML `accept` attribute value. */
export function matchesAccept(file: File, accept?: string) {
  const rules = accept?.trim()
  if (!rules) return true
  return rules.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (!rule) return false
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

/** Treat MIME `image/*` or common image extensions as image files. */
export function isImageFile(file: Pick<FileUploadFile, 'name' | 'type'>) {
  if (file.type?.startsWith('image/')) return true
  return /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(file.name)
}

/** Human-readable file size for list labels. */
export function formatSize(size = 0) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
