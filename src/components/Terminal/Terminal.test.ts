import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdTerminal from './Terminal.vue'

describe('WdTerminal', () => {
  it('emits command on submit', async () => {
    const wrapper = mount(WdTerminal, {
      props: { welcomeMessage: 'Hello' },
    })
    expect(wrapper.text()).toContain('Hello')
    await wrapper.find('.wd-terminal__input').setValue('help')
    await wrapper.find('.wd-terminal__form').trigger('submit')
    expect(wrapper.emitted('command')?.at(-1)).toEqual(['help'])
    expect(wrapper.text()).toContain('help')
  })
})
