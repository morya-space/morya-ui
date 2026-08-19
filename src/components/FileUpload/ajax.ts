import type { FileUploadRequestOptions } from './types'

export function ajaxUpload(options: FileUploadRequestOptions): XMLHttpRequest {
  const xhr = new XMLHttpRequest()
  const form = new FormData()
  form.append(options.filename, options.file, options.file.name)
  for (const [key, value] of Object.entries(options.data)) {
    form.append(key, value)
  }

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable && event.total) {
      options.onProgress(Math.round((event.loaded / event.total) * 100))
    }
  })
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      let body: unknown = xhr.responseText
      try {
        body = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText
      } catch {
        /* keep text */
      }
      options.onSuccess(body)
      return
    }
    options.onError(new Error(xhr.statusText || `Upload failed (${xhr.status})`))
  })
  xhr.addEventListener('error', () => options.onError(new Error('Network error')))
  xhr.addEventListener('abort', () => options.onError(new Error('aborted')))
  xhr.open(options.method, options.action)
  xhr.withCredentials = options.withCredentials
  for (const [key, value] of Object.entries(options.headers)) {
    xhr.setRequestHeader(key, value)
  }
  xhr.send(form)
  return xhr
}
