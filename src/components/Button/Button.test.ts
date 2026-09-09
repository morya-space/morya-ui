import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MButton from './Button.vue'

describe('muButton', () => {
  it('renders slot label and emits click when enabled', async () => {
    const wrapper = mount(MButton, { slots: { default: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('m-button--primary')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders label prop when no default slot content', () => {
    const wrapper = mount(MButton, { props: { label: 'Submit' } })
    expect(wrapper.text()).toContain('Submit')
  })

  it('does not emit click while disabled or loading', async () => {
    const disabled = mount(MButton, { props: { disabled: true, label: 'X' } })
    const loading = mount(MButton, { props: { loading: true, label: 'X' } })

    await disabled.get('button').trigger('click')
    await loading.get('button').trigger('click')

    expect(disabled.emitted('click')).toBeUndefined()
    expect(loading.emitted('click')).toBeUndefined()
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.m-button__spinner').exists()).toBe(true)
  })

  it('applies severity and style modifiers', () => {
    const wrapper = mount(MButton, {
      props: {
        label: 'Warn',
        severity: 'warn',
        raised: true,
        rounded: true,
        outlined: true,
        text: true,
        link: true,
        plain: true,
        fluid: true,
      },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'm-button--warn',
        'm-button--raised',
        'm-button--rounded',
        'm-button--outlined',
        'm-button--text',
        'm-button--link',
        'm-button--plain',
        'm-button--fluid',
      ]),
    )
  })

  it('supports variant shortcut and size aliases', () => {
    const outlined = mount(MButton, { props: { label: 'A', variant: 'outlined', size: 'small' } })
    const large = mount(MButton, { props: { label: 'B', size: 'lg' } })

    expect(outlined.classes()).toEqual(expect.arrayContaining(['m-button--outlined', 'm-button--small']))
    expect(large.classes()).toContain('m-button--large')
  })

  it('renders icon, iconPos, iconOnly, badge and aria-label', () => {
    const wrapper = mount(MButton, {
      props: {
        icon: 'edit',
        iconOnly: true,
        iconPos: 'top',
        badge: '2',
        badgeSeverity: 'danger',
        ariaLabel: 'Edit item',
        severity: 'help',
      },
    })

    expect(wrapper.find('.m-button__icon').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-button--icon-only', 'm-button--icon-top', 'm-button--help']),
    )
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edit item')
    expect(wrapper.find('.m-button__badge--danger').text()).toBe('2')
  })

  it('supports fluid layout and exposes focus/ref', () => {
    const wrapper = mount(MButton, {
      props: { label: 'Focus', fluid: true },
      attachTo: document.body,
    })
    const instance = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }

    expect(wrapper.classes()).toContain('m-button--fluid')
    instance.focus()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    expect(instance.ref).toBe(wrapper.get('button').element)

    wrapper.unmount()
  })

  it('applies ghost, quaternary, and custom color', () => {
    const ghost = mount(MButton, { props: { label: 'Ghost', variant: 'ghost' } })
    const color = mount(MButton, { props: { label: 'Tint', color: '#e11d48' } })
    expect(ghost.classes()).toContain('m-button--ghost')
    expect(color.classes()).toContain('m-button--custom')
    expect(color.attributes('style')).toContain('--m-button-color: #e11d48')
  })

  it('maps button size to icon sizing', () => {
    const small = mount(MButton, { props: { icon: 'edit', iconOnly: true, size: 'small', ariaLabel: 'Edit' } })
    const large = mount(MButton, { props: { icon: 'edit', iconOnly: true, size: 'large', ariaLabel: 'Edit' } })

    expect(small.find('.m-icon').classes()).toContain('m-icon--small')
    expect(large.find('.m-icon').classes()).toContain('m-icon--large')
  })

  it('tags custom icon components for button icon normalization', () => {
    const LargeIcon = {
      template: '<svg data-testid="custom-icon" />',
    }
    const wrapper = mount(MButton, {
      props: { icon: LargeIcon, iconOnly: true, ariaLabel: 'Custom' },
    })

    expect(wrapper.find('[data-testid="custom-icon"]').classes()).toContain('m-button__icon-graphic')
  })
})
