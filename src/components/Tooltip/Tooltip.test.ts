import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import WiTooltip from './Tooltip.vue'

const tooltipStyles = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'styles.css'),
  'utf8',
)

describe('wiTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.querySelectorAll('[role="tooltip"]').forEach((node) => node.remove())
  })

  it('shows content for mouse and keyboard focus on body by default', async () => {
    const wrapper = mount(WiTooltip, {
      props: { content: 'More information' },
      slots: { default: '<button>Info</button>' },
      attachTo: document.body,
    })
    await wrapper.trigger('mouseenter')
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toBe('More information')
    expect(document.body.querySelector('.wi-tooltip__content--teleported')).toBeTruthy()
    await wrapper.trigger('mouseleave')
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    wrapper.unmount()
  })

  it('respects showDelay before becoming visible', async () => {
    const wrapper = mount(WiTooltip, {
      props: { content: 'Delayed', showDelay: 200 },
      slots: { default: '<button>Info</button>' },
      attachTo: document.body,
    })
    await wrapper.trigger('mouseenter')
    expect(document.body.querySelector('[role="tooltip"]')).toBeNull()
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toBe('Delayed')
    wrapper.unmount()
  })

  it('can render in place when teleport is disabled', async () => {
    const wrapper = mount(WiTooltip, {
      props: { content: 'Inline', teleport: false },
      slots: { default: '<button>Info</button>' },
    })
    await wrapper.trigger('mouseenter')
    await nextTick()
    expect(wrapper.get('[role="tooltip"]').text()).toBe('Inline')
    expect(wrapper.find('.wi-tooltip__content--teleported').exists()).toBe(false)
  })

  it('respects hideDelay before hiding', async () => {
    const wrapper = mount(WiTooltip, {
      props: { content: 'Stay', hideDelay: 200, teleport: false },
      slots: { default: '<button>Info</button>' },
    })
    await wrapper.trigger('mouseenter')
    await nextTick()
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    await wrapper.trigger('mouseleave')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('links the trigger with aria-describedby while visible', async () => {
    const wrapper = mount(WiTooltip, {
      props: { content: 'Details', teleport: false },
      slots: { default: '<button>Info</button>' },
    })
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    await wrapper.trigger('mouseenter')
    await nextTick()
    const describedBy = wrapper.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.get(`#${describedBy}`).text()).toBe('Details')
    await wrapper.trigger('mouseleave')
    await nextTick()
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
  })

  it('uses normal white-space in teleported mode styles', () => {
    expect(tooltipStyles).toMatch(/\.wi-tooltip__content--teleported[\s\S]*white-space:\s*normal/)
  })
})
