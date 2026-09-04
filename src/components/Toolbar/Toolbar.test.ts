import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdToolbar from './Toolbar.vue'

describe('wdToolbar', () => {
  it('renders start, center, and end slots', () => {
    const wrapper = mount(WdToolbar, {
      slots: {
        start: 'Start',
        center: 'Center',
        end: 'End',
      },
    })
    expect(wrapper.get('.wd-toolbar__start').text()).toBe('Start')
    expect(wrapper.get('.wd-toolbar__center').text()).toBe('Center')
    expect(wrapper.get('.wd-toolbar__end').text()).toBe('End')
  })
})
