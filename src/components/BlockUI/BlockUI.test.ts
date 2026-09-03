import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiBlockUI from './BlockUI.vue'

const blockUiStyles = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'styles.css'),
  'utf8',
)

describe('wiBlockUI', () => {
  it('renders default slot without overlay when not blocked', () => {
    const wrapper = mount(WiBlockUI, { slots: { default: '<p>Content</p>' } })
    expect(wrapper.text()).toContain('Content')
    expect(wrapper.find('.wi-blockui__overlay').exists()).toBe(false)
  })

  it('shows overlay when blocked', () => {
    const wrapper = mount(WiBlockUI, {
      props: { blocked: true },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.classes()).toContain('wi-blockui--blocked')
    expect(wrapper.find('.wi-blockui__overlay').exists()).toBe(true)
  })

  it('marks content inert and busy when blocked', () => {
    const wrapper = mount(WiBlockUI, {
      props: { blocked: true },
      slots: { default: '<button type="button">Action</button>' },
    })
    const content = wrapper.find('.wi-blockui__content')
    expect(content.attributes('inert')).toBeDefined()
    expect(content.attributes('aria-busy')).toBe('true')
  })

  it('uses component z-index token on overlay', () => {
    expect(blockUiStyles).toContain('--wi-blockui-z-index')
    expect(blockUiStyles).toMatch(/z-index:\s*var\(--wi-blockui-z-index\)/)
  })
})
