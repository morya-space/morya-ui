import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import RdDock from './Dock.vue'

describe('rdDock', () => {
  it('renders dock icons and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(RdDock, {
      props: { model: [{ label: 'Finder', icon: '📁', command }] },
    })
    expect(wrapper.classes()).toContain('rd-dock')
    await wrapper.find('.rd-dock__button').trigger('click')
    expect(command).toHaveBeenCalled()
  })
})
