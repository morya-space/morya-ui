import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiFileUpload from './FileUpload.vue'

function makeFile(name = 'hello.txt', type = 'text/plain', content = 'hello') {
  return new File([content], name, { type })
}

async function pick(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.find('.wi-fileupload__input')
  Object.defineProperty(input.element, 'files', {
    value: files,
    configurable: true,
  })
  await input.trigger('change')
  await nextTick()
  await Promise.resolve()
}

describe('wiFileUpload', () => {
  it('emits select when files change', async () => {
    const wrapper = mount(WiFileUpload, { props: { mode: 'advanced' } })
    const file = makeFile()
    await pick(wrapper, [file])
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toEqual([file])
    expect(wrapper.text()).toContain('hello.txt')
  })

  it('opens picker on choose click', async () => {
    const wrapper = mount(WiFileUpload)
    const input = wrapper.find('.wi-fileupload__input').element as HTMLInputElement
    const click = vi.spyOn(input, 'click').mockImplementation(() => undefined)
    await wrapper.find('.wi-fileupload__choose').trigger('click')
    expect(click).toHaveBeenCalled()
  })

  it('renders a drop zone when drag is enabled', async () => {
    const wrapper = mount(WiFileUpload, { props: { drag: true } })
    expect(wrapper.find('.wi-fileupload__dragger').exists()).toBe(true)
    expect(wrapper.find('.wi-fileupload__choose').exists()).toBe(false)
    expect(wrapper.text()).toContain('将文件拖到此处')
  })

  it('emits select when files are dropped', async () => {
    const wrapper = mount(WiFileUpload, { props: { drag: true, multiple: true } })
    const file = makeFile()
    await wrapper.find('.wi-fileupload__dragger').trigger('drop', {
      dataTransfer: { files: [file] },
    })
    await nextTick()
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toEqual([file])
    expect(wrapper.text()).toContain('hello.txt')
  })

  it('highlights the drop zone while dragging over', async () => {
    const wrapper = mount(WiFileUpload, { props: { drag: true } })
    const zone = wrapper.find('.wi-fileupload__dragger')
    await zone.trigger('dragover', { dataTransfer: { dropEffect: 'none' } })
    expect(zone.classes()).toContain('wi-fileupload__dragger--over')
    await zone.trigger('dragleave')
    expect(zone.classes()).not.toContain('wi-fileupload__dragger--over')
  })

  it('emits exceed when dropped files go past the limit', async () => {
    const wrapper = mount(WiFileUpload, { props: { drag: true, multiple: true, limit: 1 } })
    await wrapper.find('.wi-fileupload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile('a.txt'), makeFile('b.txt')] },
    })
    expect(wrapper.emitted('exceed')?.[0]?.[0]).toHaveLength(2)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('emits exceed when appending files would pass the limit', async () => {
    const wrapper = mount(WiFileUpload, { props: { drag: true, multiple: true, limit: 2 } })
    const zone = wrapper.find('.wi-fileupload__dragger')
    await zone.trigger('drop', { dataTransfer: { files: [makeFile('a.txt')] } })
    await nextTick()
    expect(wrapper.emitted('select')).toHaveLength(1)

    await zone.trigger('drop', {
      dataTransfer: { files: [makeFile('b.txt'), makeFile('c.txt')] },
    })
    expect(wrapper.emitted('exceed')?.[0]?.[0]).toHaveLength(2)
    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('removes a listed file', async () => {
    const wrapper = mount(WiFileUpload, { props: { mode: 'advanced' } })
    await pick(wrapper, [makeFile()])
    expect(wrapper.find('.wi-fileupload__file').exists()).toBe(true)

    await wrapper.find('[aria-label="删除文件"]').trigger('click')
    await nextTick()
    expect(wrapper.emitted('remove')?.[0]?.[0]).toMatchObject({ name: 'hello.txt' })
    expect(wrapper.find('.wi-fileupload__file').exists()).toBe(false)
  })

  it('skips files rejected by beforeUpload', async () => {
    const wrapper = mount(WiFileUpload, {
      props: { mode: 'advanced', beforeUpload: () => false },
    })
    await pick(wrapper, [makeFile()])
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.find('.wi-fileupload__file').exists()).toBe(false)
  })

  it('uploads through httpRequest and emits success', async () => {
    const httpRequest = vi.fn(async () => ({ ok: true }))
    const wrapper = mount(WiFileUpload, {
      props: { mode: 'advanced', httpRequest },
    })
    await pick(wrapper, [makeFile()])
    await vi.waitFor(() => {
      expect(wrapper.emitted('success')).toBeTruthy()
    })
    expect(httpRequest).toHaveBeenCalled()
    expect(wrapper.emitted('success')?.at(-1)?.[1]).toEqual({ ok: true })
  })

  it('waits for submit when autoUpload is false', async () => {
    const httpRequest = vi.fn(async () => ({ ok: true }))
    const wrapper = mount(WiFileUpload, {
      props: { mode: 'advanced', autoUpload: false, httpRequest },
    })
    await pick(wrapper, [makeFile()])
    expect(httpRequest).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('上传')

    await wrapper.find('.wi-fileupload__toolbar .wi-fileupload__choose').trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.emitted('success')).toBeTruthy()
    })
    expect(httpRequest).toHaveBeenCalledTimes(1)
  })

  it('renders picture-card add tile and opens the picker', async () => {
    const wrapper = mount(WiFileUpload, { props: { listType: 'picture-card' } })
    expect(wrapper.find('.wi-fileupload__choose').exists()).toBe(false)
    expect(wrapper.find('.wi-fileupload__card--add').exists()).toBe(true)

    const input = wrapper.find('.wi-fileupload__input').element as HTMLInputElement
    const click = vi.spyOn(input, 'click').mockImplementation(() => undefined)
    await wrapper.find('.wi-fileupload__card--add').trigger('click')
    expect(click).toHaveBeenCalled()
  })

  it('keeps files rejected by accept out of the list', async () => {
    const wrapper = mount(WiFileUpload, {
      props: { drag: true, accept: 'image/*' },
    })
    await wrapper.find('.wi-fileupload__dragger').trigger('drop', {
      dataTransfer: { files: [makeFile('notes.txt', 'text/plain')] },
    })
    await nextTick()
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('sets directory attributes on the file input', () => {
    const wrapper = mount(WiFileUpload, { props: { directory: true } })
    const input = wrapper.find('.wi-fileupload__input').element as HTMLInputElement
    expect(input.multiple).toBe(true)
    expect(input.hasAttribute('webkitdirectory')).toBe(true)
  })

  it('emits exceed-size for oversized files', async () => {
    const wrapper = mount(WiFileUpload, { props: { maxSize: 4 } })
    await pick(wrapper, [makeFile('big.txt', 'text/plain', 'toolarge')])
    expect(wrapper.emitted('exceed-size')?.[0]?.[0]).toMatchObject({ name: 'big.txt' })
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('does not emit change on upload progress updates only', async () => {
    let progressHandler: ((percent: number) => void) | undefined
    const httpRequest = vi.fn(({ onProgress }: { onProgress: (percent: number) => void }) => {
      progressHandler = onProgress
    })
    const wrapper = mount(WiFileUpload, {
      props: { mode: 'advanced', httpRequest },
    })
    await pick(wrapper, [makeFile()])
    const changesAfterSelect = wrapper.emitted('change')?.length ?? 0
    expect(changesAfterSelect).toBeGreaterThan(0)
    progressHandler?.(50)
    progressHandler?.(75)
    await nextTick()
    expect(wrapper.emitted('change')?.length).toBe(changesAfterSelect)
  })
})
