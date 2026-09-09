import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MDock from './Dock.vue'

describe('muDock', () => {
  it('renders dock icons and runs command', async () => {
    const command = vi.fn()
    const wrapper = mount(MDock, {
      props: { model: [{ label: 'Finder', icon: '📁', command }] },
    })
    expect(wrapper.classes()).toContain('m-dock')
    await wrapper.find('.m-dock__button').trigger('click')
    expect(command).toHaveBeenCalled()
  })
})
