import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MAlert from './Alert.vue'

describe('muAlert', () => {
  it('renders title and description with severity tone', () => {
    const wrapper = mount(MAlert, {
      props: {
        severity: 'success',
        title: 'Saved',
        description: 'Your changes are live.',
      },
    })
    expect(wrapper.classes()).toContain('m-alert--success')
    expect(wrapper.find('.m-alert__title').text()).toBe('Saved')
    expect(wrapper.find('.m-alert__description').text()).toBe('Your changes are live.')
    expect(wrapper.attributes('role')).toBe('status')
  })

  it('uses role=alert for warning and error', () => {
    const warning = mount(MAlert, { props: { severity: 'warning', description: 'Careful' } })
    const error = mount(MAlert, { props: { severity: 'error', description: 'Failed' } })
    expect(warning.attributes('role')).toBe('alert')
    expect(error.attributes('role')).toBe('alert')
    expect(error.classes()).toContain('m-alert--error')
  })

  it('hides icon when showIcon is false', () => {
    const wrapper = mount(MAlert, {
      props: { description: 'No icon', showIcon: false },
    })
    expect(wrapper.find('.m-alert__icon').exists()).toBe(false)
  })

  it('emits close and unmounts content when closable', async () => {
    const wrapper = mount(MAlert, {
      props: { description: 'Dismiss me', closable: true },
    })
    await wrapper.get('.m-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.m-alert').exists()).toBe(false)
  })

  it('renders action and title slots', () => {
    const wrapper = mount(MAlert, {
      props: { severity: 'info' },
      slots: {
        title: 'Custom title',
        default: 'Body copy',
        action: '<button type="button">Undo</button>',
      },
    })
    expect(wrapper.find('.m-alert__title').text()).toBe('Custom title')
    expect(wrapper.find('.m-alert__description').text()).toBe('Body copy')
    expect(wrapper.find('.m-alert__action button').text()).toBe('Undo')
  })

  it('applies banner modifier', () => {
    const wrapper = mount(MAlert, {
      props: { description: 'Banner', banner: true },
    })
    expect(wrapper.classes()).toContain('m-alert--banner')
  })
})
