import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import WdDock from './Dock.vue'

describe('WdDock', () => {
  it('renders dock icons and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(WdDock, {
      props: { model: [{ label: 'Finder', icon: '📁', command }] },
    })
    expect(wrapper.classes()).toContain('wd-dock')
    await wrapper.find('.wd-dock__button').trigger('click')
    expect(command).toHaveBeenCalled()
  })
})
