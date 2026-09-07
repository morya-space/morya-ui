import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RdButton from './Button.vue'

describe('rdButton', () => {
  it('renders slot label and emits click when enabled', async () => {
    const wrapper = mount(RdButton, { slots: { default: 'Save' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('Save')
    expect(wrapper.classes()).toContain('rd-button--primary')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders label prop when no default slot content', () => {
    const wrapper = mount(RdButton, { props: { label: 'Submit' } })
    expect(wrapper.text()).toContain('Submit')
  })

  it('does not emit click while disabled or loading', async () => {
    const disabled = mount(RdButton, { props: { disabled: true, label: 'X' } })
    const loading = mount(RdButton, { props: { loading: true, label: 'X' } })

    await disabled.get('button').trigger('click')
    await loading.get('button').trigger('click')

    expect(disabled.emitted('click')).toBeUndefined()
    expect(loading.emitted('click')).toBeUndefined()
    expect(loading.get('button').attributes('aria-busy')).toBe('true')
    expect(loading.find('.rd-button__spinner').exists()).toBe(true)
  })

  it('applies severity and style modifiers', () => {
    const wrapper = mount(RdButton, {
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
        'rd-button--warn',
        'rd-button--raised',
        'rd-button--rounded',
        'rd-button--outlined',
        'rd-button--text',
        'rd-button--link',
        'rd-button--plain',
        'rd-button--fluid',
      ]),
    )
  })

  it('supports variant shortcut and size aliases', () => {
    const outlined = mount(RdButton, { props: { label: 'A', variant: 'outlined', size: 'small' } })
    const large = mount(RdButton, { props: { label: 'B', size: 'lg' } })

    expect(outlined.classes()).toEqual(expect.arrayContaining(['rd-button--outlined', 'rd-button--small']))
    expect(large.classes()).toContain('rd-button--large')
  })

  it('renders icon, iconPos, iconOnly, badge and aria-label', () => {
    const wrapper = mount(RdButton, {
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

    expect(wrapper.find('.rd-button__icon').exists()).toBe(true)
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['rd-button--icon-only', 'rd-button--icon-top', 'rd-button--help']),
    )
    expect(wrapper.get('button').attributes('aria-label')).toBe('Edit item')
    expect(wrapper.find('.rd-button__badge--danger').text()).toBe('2')
  })

  it('supports fluid layout and exposes focus/ref', () => {
    const wrapper = mount(RdButton, {
      props: { label: 'Focus', fluid: true },
      attachTo: document.body,
    })
    const instance = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }

    expect(wrapper.classes()).toContain('rd-button--fluid')
    instance.focus()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    expect(instance.ref).toBe(wrapper.get('button').element)

    wrapper.unmount()
  })

  it('applies ghost, quaternary, and custom color', () => {
    const ghost = mount(RdButton, { props: { label: 'Ghost', variant: 'ghost' } })
    const color = mount(RdButton, { props: { label: 'Tint', color: '#e11d48' } })
    expect(ghost.classes()).toContain('rd-button--ghost')
    expect(color.classes()).toContain('rd-button--custom')
    expect(color.attributes('style')).toContain('--rd-button-color: #e11d48')
  })

  it('maps button size to icon sizing', () => {
    const small = mount(RdButton, { props: { icon: 'edit', iconOnly: true, size: 'small', ariaLabel: 'Edit' } })
    const large = mount(RdButton, { props: { icon: 'edit', iconOnly: true, size: 'large', ariaLabel: 'Edit' } })

    expect(small.find('.rd-icon').classes()).toContain('rd-icon--small')
    expect(large.find('.rd-icon').classes()).toContain('rd-icon--large')
  })

  it('tags custom icon components for button icon normalization', () => {
    const LargeIcon = {
      template: '<svg data-testid="custom-icon" />',
    }
    const wrapper = mount(RdButton, {
      props: { icon: LargeIcon, iconOnly: true, ariaLabel: 'Custom' },
    })

    expect(wrapper.find('[data-testid="custom-icon"]').classes()).toContain('rd-button__icon-graphic')
  })
})
