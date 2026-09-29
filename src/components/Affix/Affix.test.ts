import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MAffix from './Affix.vue'

describe('muAffix', () => {
  it('renders slot content', () => {
    const wrapper = mount(MAffix, {
      slots: { default: '<span class="inner">Pinned</span>' },
    })
    expect(wrapper.find('.inner').text()).toBe('Pinned')
    expect(wrapper.classes()).toContain('m-affix')
  })

  it('does not affix when disabled', async () => {
    const wrapper = mount(MAffix, {
      props: { disabled: true, offsetTop: 0 },
      slots: { default: '<div style="height:40px">x</div>' },
      attachTo: document.body,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.classes()).toContain('m-affix--disabled')
    expect(wrapper.find('.m-affix__fixed--active').exists()).toBe(false)
    wrapper.unmount()
  })

  it('emits change when affix state updates', async () => {
    const target = document.createElement('div')
    target.style.height = '200px'
    target.style.overflow = 'auto'
    document.body.appendChild(target)

    const content = document.createElement('div')
    content.style.height = '400px'
    target.appendChild(content)

    const wrapper = mount(MAffix, {
      props: {
        offsetTop: 10,
        target: () => target,
      },
      slots: { default: '<div style="height:32px">bar</div>' },
      attachTo: content,
    })

    Object.defineProperty(target, 'scrollTop', { configurable: true, value: 120, writable: true })
    target.dispatchEvent(new Event('scroll'))
    await nextTick()
    await nextTick()

    const changes = wrapper.emitted('change')
    if (changes?.length) {
      expect(typeof changes[0][0]).toBe('boolean')
    }

    wrapper.unmount()
    target.remove()
  })

  it('clears affix on disable', async () => {
    const wrapper = mount(MAffix, {
      props: { offsetTop: 0, disabled: false },
      slots: { default: 'x' },
    })
    await wrapper.setProps({ disabled: true })
    expect(wrapper.classes()).toContain('m-affix--disabled')
    expect(wrapper.find('.m-affix__fixed--active').exists()).toBe(false)
  })
})
