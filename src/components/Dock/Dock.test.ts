import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WiDock from './Dock.vue'

describe('wiDock', () => {
  it('renders dock icons and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WiDock, {
      props: { model: [{ label: 'Finder', icon: '📁', command }] },
    })
    expect(wrapper.classes()).toContain('wi-dock')
    await wrapper.find('.wi-dock__button').trigger('click')
    expect(command).toHaveBeenCalled()
  })
})
