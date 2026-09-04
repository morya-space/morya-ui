import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WdButton from './Button.vue'

describe('wdButton', () => {
  it('renders slot label and emits click when enabled', async () => {
    const wrapper = mount(WdButton, { slots: { default: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('wd-button--primary')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders label prop when no default slot content', () => {
    const wrapper = mount(WdButton, { props: { label: 'Submit' } })
    expect(wrapper.text()).toContain('Submit')
  })

  it('does not emit click while disabled or loading', async () => {
    const disabled = mount(WdButton, { props: { disabled: true, label: 'X' } })
    const loading = mount(WdButton, { props: { loading: true, label: 'X' } })

    await disabled.get('button').trigger('click')
    await loading.get('button').trigger('click')

    expect(disabled.emitted('click')).toBeUndefined()
    expect(loading.emitted('click')).toBeUndefined()
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.wd-button__spinner').exists()).toBe(true)
  })

  it('applies severity and style modifiers', () => {
    const wrapper = mount(WdButton, {
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
        'wd-button--warn',
        'wd-button--raised',
        'wd-button--rounded',
        'wd-button--outlined',
        'wd-button--text',
        'wd-button--link',
        'wd-button--plain',
        'wd-button--fluid',
      ]),
    )
  })

  it('supports variant shortcut and size aliases', () => {
    const outlined = mount(WdButton, { props: { label: 'A', variant: 'outlined', size: 'small' } })
    const large = mount(WdButton, { props: { label: 'B', size: 'lg' } })

    expect(outlined.classes()).toEqual(expect.arrayContaining(['wd-button--outlined', 'wd-button--small']))
    expect(large.classes()).toContain('wd-button--large')
  })

  it('renders icon, iconPos, iconOnly, badge and aria-label', () => {
    const wrapper = mount(WdButton, {
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

    expect(wrapper.find('.wd-button__icon').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['wd-button--icon-only', 'wd-button--icon-top', 'wd-button--help']),
    )
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edit item')
    expect(wrapper.find('.wd-button__badge--danger').text()).toBe('2')
  })

  it('supports fluid layout and exposes focus/ref', () => {
    const wrapper = mount(WdButton, {
      props: { label: 'Focus', fluid: true },
      attachTo: document.body,
    })
    const instance = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }

    expect(wrapper.classes()).toContain('wd-button--fluid')
    instance.focus()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    expect(instance.ref).toBe(wrapper.get('button').element)

    wrapper.unmount()
  })

  it('applies ghost, quaternary, and custom color', () => {
    const ghost = mount(WdButton, { props: { label: 'Ghost', variant: 'ghost' } })
    const color = mount(WdButton, { props: { label: 'Tint', color: '#e11d48' } })
    expect(ghost.classes()).toContain('wd-button--ghost')
    expect(color.classes()).toContain('wd-button--custom')
    expect(color.attributes('style')).toContain('--wd-button-color: #e11d48')
  })

  it('maps button size to icon sizing', () => {
    const small = mount(WdButton, { props: { icon: 'edit', iconOnly: true, size: 'small', ariaLabel: 'Edit' } })
    const large = mount(WdButton, { props: { icon: 'edit', iconOnly: true, size: 'large', ariaLabel: 'Edit' } })

    expect(small.find('.wd-icon').classes()).toContain('wd-icon--small')
    expect(large.find('.wd-icon').classes()).toContain('wd-icon--large')
  })

  it('tags custom icon components for button icon normalization', () => {
    const LargeIcon = {
      template: '<svg data-testid="custom-icon" />',
    }
    const wrapper = mount(WdButton, {
      props: { icon: LargeIcon, iconOnly: true, ariaLabel: 'Custom' },
    })

    expect(wrapper.find('[data-testid="custom-icon"]').classes()).toContain('wd-button__icon-graphic')
  })
})
