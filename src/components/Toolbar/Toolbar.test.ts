import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MToolbar from './Toolbar.vue'

describe('muToolbar', () => {
  it('renders start, center, and end slots', () => {
    const wrapper = mount(MToolbar, {
      slots: {
        start: 'Start',
        center: 'Center',
        end: 'End',
      },
    })
    expect(wrapper.get('.m-toolbar__start').text()).toBe('Start')
    expect(wrapper.get('.m-toolbar__center').text()).toBe('Center')
    expect(wrapper.get('.m-toolbar__end').text()).toBe('End')
  })
})
