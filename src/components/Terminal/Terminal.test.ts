import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiTerminal from './Terminal.vue'

describe('wiTerminal', () => {
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

  it('uses role=log on the body', () => {
    const wrapper = mount(WiTerminal)
    expect(wrapper.find('.wi-terminal__body').attributes('role')).toBe('log')
    expect(wrapper.find('.wi-terminal').attributes('role')).toBeUndefined()
  })

  it('displays controlled lines and responses', () => {
    const wrapper = mount(WiTerminal, {
      props: {
        lines: ['help', 'clear'],
        responses: ['Available commands', 'Done'],
      },
    })
    expect(wrapper.text()).toContain('help')
    expect(wrapper.text()).toContain('Available commands')
    expect(wrapper.text()).toContain('clear')
    expect(wrapper.text()).toContain('Done')
  })

  it('emits update:lines when uncontrolled', async () => {
    const wrapper = mount(WiTerminal)
    await wrapper.find('.wi-terminal__input').setValue('ls')
    await wrapper.find('.wi-terminal__form').trigger('submit')
    expect(wrapper.emitted('update:lines')?.at(-1)).toEqual([['ls']])
  })

  it('emits update:responses via appendResponse', async () => {
    const wrapper = mount(WiTerminal)
    await wrapper.find('.wi-terminal__input').setValue('help')
    await wrapper.find('.wi-terminal__form').trigger('submit')
    ;(wrapper.vm as { appendResponse: (text: string) => void }).appendResponse('Available commands')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:responses')?.at(-1)).toEqual([['Available commands']])
    expect(wrapper.find('.wi-terminal__response').text()).toBe('Available commands')
  })

  it('navigates command history with arrow keys', async () => {
    const wrapper = mount(WiTerminal, {
      props: { lines: ['first', 'second'] },
    })
    const input = wrapper.find('.wi-terminal__input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect((input.element as HTMLInputElement).value).toBe('second')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect((input.element as HTMLInputElement).value).toBe('first')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect((input.element as HTMLInputElement).value).toBe('second')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
