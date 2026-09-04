import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdScrollbar from './Scrollbar.vue'
import Thumb from './Thumb.vue'

describe('Thumb', () => {
  it('renders thumb elements inside Scrollbar when always visible', async () => {
    const wrapper = mount(WdScrollbar, {
      props: { height: 120, always: true },
      slots: {
        default: Array.from({ length: 20 }, (_, i) => `<p style="height:40px">${i}</p>`).join(''),
      },
      attachTo: document.body,
    })
    expect(wrapper.findAll('.wd-scrollbar__thumb').length).toBe(2)
    wrapper.unmount()
  })

  it('throws when used outside Scrollbar context', () => {
    expect(() => mount(Thumb, { props: { size: '20%', move: 0, ratio: 1 } })).toThrow(
      '[WdScrollbar] Thumb must be used inside WdScrollbar',
    )
  })
})
