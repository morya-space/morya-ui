import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdToolbar from './Toolbar.vue'

describe('rdToolbar', () => {
  it('renders start, center, and end slots', () => {
    const wrapper = mount(RdToolbar, {
      slots: {
        start: 'Start',
        center: 'Center',
        end: 'End',
      },
    })
    expect(wrapper.get('.rd-toolbar__start').text()).toBe('Start')
    expect(wrapper.get('.rd-toolbar__center').text()).toBe('Center')
    expect(wrapper.get('.rd-toolbar__end').text()).toBe('End')
  })
})
