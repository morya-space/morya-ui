import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WkDock from './Dock.vue'

describe('wkDock', () => {
  it('renders dock icons and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WkDock, {
      props: { model: [{ label: 'Finder', icon: '📁', command }] },
    })
    expect(wrapper.classes()).toContain('wk-dock')
    await wrapper.find('.wk-dock__button').trigger('click')
    expect(command).toHaveBeenCalled()
  })
})
