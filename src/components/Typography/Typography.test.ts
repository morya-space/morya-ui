import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MLink from './Link.vue'
import MParagraph from './Paragraph.vue'
import MText from './Text.vue'
import MTitle from './Title.vue'

describe('MTypography', () => {
  it('renders Title level=2 as h2', () => {
    const wrapper = mount(MTitle, {
      props: { level: 2 },
      slots: { default: 'Heading' },
    })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('m-typography-title--h2')
    expect(wrapper.text()).toBe('Heading')
  })

  it('applies Text type=danger class', () => {
    const wrapper = mount(MText, {
      props: { type: 'danger' },
      slots: { default: 'Danger' },
    })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.classes()).toContain('m-typography--danger')
  })

  it('renders Link with href', () => {
    const wrapper = mount(MLink, {
      props: { href: 'https://example.com' },
      slots: { default: 'Docs' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
    expect(wrapper.classes()).toContain('m-typography-link')
  })

  it('renders Paragraph as p', () => {
    const wrapper = mount(MParagraph, {
      slots: { default: 'Body copy' },
    })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('m-typography-paragraph')
    expect(wrapper.text()).toBe('Body copy')
  })
})

describe('MTypography ellipsis', () => {
  it('clamps a single line by default', () => {
    const wrapper = mount(MText, {
      props: { ellipsis: true },
      slots: { default: 'A long sentence' },
    })
    const content = wrapper.find('.m-typography__content')
    expect(content.classes()).toContain('m-typography--ellipsis')
    expect(content.classes()).not.toContain('m-typography--ellipsis-multiline')
  })

  it('applies the row count for multi-line ellipsis', () => {
    const wrapper = mount(MParagraph, {
      props: { ellipsis: { rows: 3 } },
      slots: { default: 'A long paragraph' },
    })
    const content = wrapper.find('.m-typography__content')
    expect(content.classes()).toContain('m-typography--ellipsis-multiline')
    expect(content.attributes('style')).toContain('--m-typography-rows: 3')
  })

  it('does not clamp when ellipsis is off', () => {
    const wrapper = mount(MParagraph, { slots: { default: 'Plain' } })
    expect(wrapper.find('.m-typography__content').classes()).not.toContain('m-typography--ellipsis')
  })

  it('toggles expanded state through the expand control', async () => {
    const wrapper = mount(MParagraph, {
      props: { ellipsis: { rows: 2, expandable: true } },
      slots: { default: 'A long paragraph' },
    })
    const expand = wrapper.find('.m-typography__expand')
    expect(expand.exists()).toBe(true)
    expect(expand.attributes('aria-expanded')).toBe('false')

    await expand.trigger('click')
    expect(wrapper.find('.m-typography__expand').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.m-typography__content').classes()).toContain('m-typography--ellipsis-expanded')
    expect(wrapper.find('.m-typography__content').attributes('style')).toBeUndefined()
  })

  it('hides the expand control for single-line ellipsis', () => {
    const wrapper = mount(MParagraph, {
      props: { ellipsis: { expandable: true } },
      slots: { default: 'One line' },
    })
    expect(wrapper.find('.m-typography__expand').exists()).toBe(false)
  })

  it('renders a suffix while clamped', () => {
    const wrapper = mount(MParagraph, {
      props: { ellipsis: { rows: 2, suffix: '...' } },
      slots: { default: 'Body' },
    })
    expect(wrapper.find('.m-typography__ellipsis-suffix').text()).toBe('...')
  })
})

describe('MTypography copyable', () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    writeText.mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  it('copies the rendered text and reports success', async () => {
    const onCopy = vi.fn()
    const wrapper = mount(MText, {
      props: { copyable: { onCopy } },
      slots: { default: 'Copy me' },
    })

    const button = wrapper.find('.m-typography__copy')
    expect(button.exists()).toBe(true)

    await button.trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('Copy me'))
    expect(onCopy).toHaveBeenCalledWith('Copy me')
    expect(wrapper.find('.m-typography__copy').attributes('aria-label')).toBe('已复制')
  })

  it('prefers an explicit text and applies the format hook', async () => {
    const wrapper = mount(MText, {
      props: { copyable: { text: 'raw', format: value => value.toUpperCase() } },
      slots: { default: 'ignored' },
    })

    await wrapper.find('.m-typography__copy').trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('RAW'))
  })

  it('renders no copy control when copyable is off', () => {
    const wrapper = mount(MText, { slots: { default: 'Plain' } })
    expect(wrapper.find('.m-typography__copy').exists()).toBe(false)
  })

  it('supports copyable on a Link', async () => {
    const wrapper = mount(MLink, {
      props: { href: 'https://example.com', copyable: true },
      slots: { default: 'Docs' },
    })
    await wrapper.find('.m-typography__copy').trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('Docs'))
  })
})

describe('MTypography editable', () => {
  it('switches to an inline editor and commits the change', async () => {
    const onChange = vi.fn()
    const wrapper = mount(MParagraph, {
      props: { editable: { onChange } },
      slots: { default: 'Original' },
    })

    expect(wrapper.find('textarea').exists()).toBe(false)

    await wrapper.find('.m-typography__edit').trigger('click')
    const editor = wrapper.find('textarea')
    expect(editor.exists()).toBe(true)

    await editor.setValue('Updated')
    await editor.trigger('blur')

    expect(onChange).toHaveBeenCalledWith('Updated')
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('keeps editing when the change is rejected', async () => {
    const wrapper = mount(MParagraph, {
      props: { editable: { onChange: () => false } },
      slots: { default: 'Original' },
    })

    await wrapper.find('.m-typography__edit').trigger('click')
    const editor = wrapper.find('textarea')
    await editor.setValue('Rejected')
    await editor.trigger('blur')

    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('shows an error state when the change returns a message', async () => {
    const wrapper = mount(MParagraph, {
      props: { editable: { onChange: () => 'Too long' } },
      slots: { default: 'Original' },
    })

    await wrapper.find('.m-typography__edit').trigger('click')
    const editor = wrapper.find('textarea')
    await editor.setValue('Nope')
    await editor.trigger('blur')

    expect(wrapper.find('.m-textarea--invalid').exists()).toBe(true)
  })

  it('cancels editing on Escape', async () => {
    const onChange = vi.fn()
    const wrapper = mount(MParagraph, {
      props: { editable: { onChange } },
      slots: { default: 'Original' },
    })

    await wrapper.find('.m-typography__edit').trigger('click')
    await wrapper.find('textarea').trigger('keydown.esc')

    expect(onChange).not.toHaveBeenCalled()
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('starts in editing mode when configured', () => {
    const wrapper = mount(MParagraph, {
      props: { editable: { editing: true } },
      slots: { default: 'Original' },
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('hides the edit affordance when disabled', () => {
    const wrapper = mount(MParagraph, {
      props: { editable: true, disabled: true },
      slots: { default: 'Original' },
    })
    expect(wrapper.find('.m-typography__edit').exists()).toBe(false)
  })
})
