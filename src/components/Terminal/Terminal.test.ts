import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiTerminal from './Terminal.vue'

describe('WiTerminal', () => {
  it('emits command on submit', async () => {
    const wrapper = mount(WiTerminal, {
      props: { welcomeMessage: 'Hello' },
    })
    expect(wrapper.text()).toContain('Hello')
    await wrapper.find('.wi-terminal__input').setValue('help')
    await wrapper.find('.wi-terminal__form').trigger('submit')
    expect(wrapper.emitted('command')?.at(-1)).toEqual(['help'])
    expect(wrapper.text()).toContain('help')
  })
})
