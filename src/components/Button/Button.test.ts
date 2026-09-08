import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WkButton from './Button.vue'

describe('wkButton', () => {
  it('renders slot label and emits click when enabled', async () => {
    const wrapper = mount(WkButton, { slots: { default: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('wk-button--primary')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders label prop when no default slot content', () => {
    const wrapper = mount(WkButton, { props: { label: 'Submit' } })
    expect(wrapper.text()).toContain('Submit')
  })

  it('does not emit click while disabled or loading', async () => {
    const disabled = mount(WkButton, { props: { disabled: true, label: 'X' } })
    const loading = mount(WkButton, { props: { loading: true, label: 'X' } })

    await disabled.get('button').trigger('click')
    await loading.get('button').trigger('click')

    expect(disabled.emitted('click')).toBeUndefined()
    expect(loading.emitted('click')).toBeUndefined()
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.wk-button__spinner').exists()).toBe(true)
  })

  it('applies severity and style modifiers', () => {
    const wrapper = mount(WkButton, {
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
        'wk-button--warn',
        'wk-button--raised',
        'wk-button--rounded',
        'wk-button--outlined',
        'wk-button--text',
        'wk-button--link',
        'wk-button--plain',
        'wk-button--fluid',
      ]),
    )
  })

  it('supports variant shortcut and size aliases', () => {
    const outlined = mount(WkButton, { props: { label: 'A', variant: 'outlined', size: 'small' } })
    const large = mount(WkButton, { props: { label: 'B', size: 'lg' } })

    expect(outlined.classes()).toEqual(expect.arrayContaining(['wk-button--outlined', 'wk-button--small']))
    expect(large.classes()).toContain('wk-button--large')
  })

  it('renders icon, iconPos, iconOnly, badge and aria-label', () => {
    const wrapper = mount(WkButton, {
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

    expect(wrapper.find('.wk-button__icon').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wk-button--icon-only', 'wk-button--icon-top', 'wk-button--help']),
    )
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edit item')
    expect(wrapper.find('.wk-button__badge--danger').text()).toBe('2')
  })

  it('supports fluid layout and exposes focus/ref', () => {
    const wrapper = mount(WkButton, {
      props: { label: 'Focus', fluid: true },
      attachTo: document.body,
    })
    const instance = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }

    expect(wrapper.classes()).toContain('wk-button--fluid')
    instance.focus()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    expect(instance.ref).toBe(wrapper.get('button').element)

    wrapper.unmount()
  })

  it('applies ghost, quaternary, and custom color', () => {
    const ghost = mount(WkButton, { props: { label: 'Ghost', variant: 'ghost' } })
    const color = mount(WkButton, { props: { label: 'Tint', color: '#e11d48' } })
    expect(ghost.classes()).toContain('wk-button--ghost')
    expect(color.classes()).toContain('wk-button--custom')
    expect(color.attributes('style')).toContain('--wk-button-color: #e11d48')
  })

  it('maps button size to icon sizing', () => {
    const small = mount(WkButton, { props: { icon: 'edit', iconOnly: true, size: 'small', ariaLabel: 'Edit' } })
    const large = mount(WkButton, { props: { icon: 'edit', iconOnly: true, size: 'large', ariaLabel: 'Edit' } })

    expect(small.find('.wk-icon').classes()).toContain('wk-icon--small')
    expect(large.find('.wk-icon').classes()).toContain('wk-icon--large')
  })

  it('tags custom icon components for button icon normalization', () => {
    const LargeIcon = {
      template: '<svg data-testid="custom-icon" />',
    }
    const wrapper = mount(WkButton, {
      props: { icon: LargeIcon, iconOnly: true, ariaLabel: 'Custom' },
    })

    expect(wrapper.find('[data-testid="custom-icon"]').classes()).toContain('wk-button__icon-graphic')
  })
})
