import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiToolbar from './Toolbar.vue'

describe('wiToolbar', () => {
  it('renders start, center, and end slots', () => {
    const wrapper = mount(WiToolbar, {
      slots: {
        start: 'Start',
        center: 'Center',
        end: 'End',
      },
    })
    expect(wrapper.get('.wi-toolbar__start').text()).toBe('Start')
    expect(wrapper.get('.wi-toolbar__center').text()).toBe('Center')
    expect(wrapper.get('.wi-toolbar__end').text()).toBe('End')
  })
})
