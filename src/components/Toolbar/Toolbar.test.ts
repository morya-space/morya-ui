import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkToolbar from './Toolbar.vue'

describe('wkToolbar', () => {
  it('renders start, center, and end slots', () => {
    const wrapper = mount(WkToolbar, {
      slots: {
        start: 'Start',
        center: 'Center',
        end: 'End',
      },
    })
    expect(wrapper.get('.wk-toolbar__start').text()).toBe('Start')
    expect(wrapper.get('.wk-toolbar__center').text()).toBe('Center')
    expect(wrapper.get('.wk-toolbar__end').text()).toBe('End')
  })
})
