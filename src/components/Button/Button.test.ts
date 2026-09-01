import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WiButton from './Button.vue'

describe('wiButton', () => {
  it('renders slot label and emits click when enabled', async () => {
    const wrapper = mount(WiButton, { slots: { default: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('wi-button--primary')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders label prop when no default slot content', () => {
    const wrapper = mount(WiButton, { props: { label: 'Submit' } })
    expect(wrapper.text()).toContain('Submit')
  })

  it('does not emit click while disabled or loading', async () => {
    const disabled = mount(WiButton, { props: { disabled: true, label: 'X' } })
    const loading = mount(WiButton, { props: { loading: true, label: 'X' } })

    await disabled.get('button').trigger('click')
    await loading.get('button').trigger('click')

    expect(disabled.emitted('click')).toBeUndefined()
    expect(loading.emitted('click')).toBeUndefined()
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.wi-button__spinner').exists()).toBe(true)
  })

  it('applies severity and style modifiers', () => {
    const wrapper = mount(WiButton, {
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
        'wi-button--warn',
        'wi-button--raised',
        'wi-button--rounded',
        'wi-button--outlined',
        'wi-button--text',
        'wi-button--link',
        'wi-button--plain',
        'wi-button--fluid',
      ]),
    )
  })

  it('supports variant shortcut and size aliases', () => {
    const outlined = mount(WiButton, { props: { label: 'A', variant: 'outlined', size: 'small' } })
    const large = mount(WiButton, { props: { label: 'B', size: 'lg' } })

    expect(outlined.classes()).toEqual(expect.arrayContaining(['wi-button--outlined', 'wi-button--small']))
    expect(large.classes()).toContain('wi-button--large')
  })

  it('renders icon, iconPos, iconOnly, badge and aria-label', () => {
    const wrapper = mount(WiButton, {
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

    expect(wrapper.find('.wi-button__icon').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wi-button--icon-only', 'wi-button--icon-top', 'wi-button--help']),
    )
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edit item')
    expect(wrapper.find('.wi-button__badge--danger').text()).toBe('2')
  })

  it('supports fluid layout and exposes focus/ref', () => {
    const wrapper = mount(WiButton, {
      props: { label: 'Focus', fluid: true },
      attachTo: document.body,
    })
    const instance = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }

    expect(wrapper.classes()).toContain('wi-button--fluid')
    instance.focus()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    expect(instance.ref).toBe(wrapper.get('button').element)

    wrapper.unmount()
  })

  it('applies ghost, quaternary, and custom color', () => {
    const ghost = mount(WiButton, { props: { label: 'Ghost', variant: 'ghost' } })
    const color = mount(WiButton, { props: { label: 'Tint', color: '#e11d48' } })
    expect(ghost.classes()).toContain('wi-button--ghost')
    expect(color.classes()).toContain('wi-button--custom')
    expect(color.attributes('style')).toContain('--wi-button-color: #e11d48')
  })

  it('maps button size to icon sizing', () => {
    const small = mount(WiButton, { props: { icon: 'edit', iconOnly: true, size: 'small', ariaLabel: 'Edit' } })
    const large = mount(WiButton, { props: { icon: 'edit', iconOnly: true, size: 'large', ariaLabel: 'Edit' } })

    expect(small.find('.wi-icon').classes()).toContain('wi-icon--small')
    expect(large.find('.wi-icon').classes()).toContain('wi-icon--large')
  })

  it('tags custom icon components for button icon normalization', () => {
    const LargeIcon = {
      template: '<svg data-testid="custom-icon" />',
    }
    const wrapper = mount(WiButton, {
      props: { icon: LargeIcon, iconOnly: true, ariaLabel: 'Custom' },
    })

    expect(wrapper.find('[data-testid="custom-icon"]').classes()).toContain('wi-button__icon-graphic')
  })
})
