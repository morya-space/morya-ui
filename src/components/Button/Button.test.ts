import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MConfigProvider from '../ConfigProvider/ConfigProvider.vue'
import MButton from './Button.vue'
import { formatButtonLabel, resolveButtonAppearance, resolveColorVariant } from './buttonHelpers'

describe('buttonHelpers', () => {
  it('maps type sugar to color/variant pairs', () => {
    expect(resolveColorVariant({ type: 'primary' })).toEqual(['primary', 'solid'])
    expect(resolveColorVariant({ type: 'default' })).toEqual(['default', 'outlined'])
    expect(resolveColorVariant({ type: 'dashed' })).toEqual(['default', 'dashed'])
    expect(resolveColorVariant({ type: 'text' })).toEqual(['default', 'text'])
    expect(resolveColorVariant({ type: 'link' })).toEqual(['link', 'link'])
  })

  it('prefers explicit color+variant over type', () => {
    expect(resolveColorVariant({ type: 'primary', color: 'danger', variant: 'filled' })).toEqual([
      'danger',
      'filled',
    ])
  })

  it('applies danger sugar onto the resolved variant', () => {
    expect(resolveColorVariant({ type: 'primary', danger: true })).toEqual(['danger', 'solid'])
    expect(resolveColorVariant({ type: 'dashed', danger: true })).toEqual(['danger', 'dashed'])
  })

  it('falls back to default outlined', () => {
    expect(resolveColorVariant({})).toEqual(['default', 'outlined'])
  })

  it('converts ghost solid into outlined ghost', () => {
    expect(resolveButtonAppearance({ type: 'primary', ghost: true })).toEqual({
      color: 'primary',
      variant: 'outlined',
      ghost: true,
    })
  })

  it('formats two chinese characters with a space', () => {
    expect(formatButtonLabel('确定', true)).toBe('确 定')
    expect(formatButtonLabel('确定', false)).toBe('确定')
    expect(formatButtonLabel('提交中', true)).toBe('提交中')
  })
})

describe('MButton', () => {
  it('defaults to default outlined', () => {
    const wrapper = mount(MButton, { props: { label: 'Default' } })
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['m-button', 'm-button--color-default', 'm-button--variant-outlined']),
    )
  })

  it('applies type sugar and color/variant modifiers', () => {
    const primary = mount(MButton, { props: { label: 'Go', type: 'primary' } })
    expect(primary.classes()).toEqual(
      expect.arrayContaining(['m-button--color-primary', 'm-button--variant-solid']),
    )

    const matrix = mount(MButton, {
      props: { label: 'Save', color: 'success', variant: 'filled', shape: 'round', block: true },
    })
    expect(matrix.classes()).toEqual(
      expect.arrayContaining([
        'm-button--color-success',
        'm-button--variant-filled',
        'm-button--shape-round',
        'm-button--block',
      ]),
    )
  })

  it('supports danger and ghost', () => {
    const danger = mount(MButton, { props: { label: 'Delete', danger: true, type: 'primary' } })
    expect(danger.classes()).toContain('m-button--color-danger')
    expect(danger.classes()).toContain('m-button--variant-solid')

    const ghost = mount(MButton, { props: { label: 'Ghost', type: 'primary', ghost: true } })
    expect(ghost.classes()).toEqual(
      expect.arrayContaining([
        'm-button--color-primary',
        'm-button--variant-outlined',
        'm-button--ghost',
      ]),
    )
  })

  it('renders icon, iconPlacement, iconOnly, badge and aria-label', () => {
    const wrapper = mount(MButton, {
      props: {
        icon: 'search',
        label: 'Search',
        iconPlacement: 'end',
        badge: '2',
        badgeColor: 'danger',
        ariaLabel: 'Find',
      },
    })
    expect(wrapper.classes()).toContain('m-button--icon-end')
    expect(wrapper.find('.m-button__icon').exists()).toBe(true)
    expect(wrapper.find('.m-button__badge--danger').text()).toBe('2')
    expect(wrapper.attributes('aria-label')).toBe('Find')
  })

  it('supports loading delay and blocks click while loading', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MButton, {
      props: { label: 'Save', loading: { delay: 100 } },
    })
    expect(wrapper.classes()).not.toContain('m-button--loading')
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.classes()).toContain('m-button--loading')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    vi.useRealTimers()
  })

  it('renders as an anchor when href is set', async () => {
    const wrapper = mount(MButton, {
      props: { label: 'Docs', href: '/docs', target: '_blank' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/docs')
    expect(wrapper.attributes('target')).toBe('_blank')

    await wrapper.setProps({ disabled: true })
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('exposes focus/ref and inserts space for two chinese chars', async () => {
    const wrapper = mount(MButton, { props: { label: '确定' } })
    expect(wrapper.find('.m-button__label').text()).toBe('确 定')
    const exposed = wrapper.vm as unknown as { focus: () => void; ref: HTMLButtonElement | null }
    exposed.focus()
    expect(exposed.ref).toBeTruthy()
  })

  it('inherits disabled from ConfigProvider', () => {
    const wrapper = mount({
      components: { MConfigProvider, MButton },
      template: `
        <MConfigProvider :disabled="true">
          <MButton label="Locked" />
        </MConfigProvider>
      `,
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('reads Button defaults from componentDefaults', () => {
    const wrapper = mount({
      components: { MConfigProvider, MButton },
      template: `
        <MConfigProvider :component-defaults="{ Button: { type: undefined, color: 'primary', variant: 'solid' } }">
          <MButton label="Inherited" />
        </MConfigProvider>
      `,
    })
    // Without type/danger, context color+variant apply
    expect(wrapper.find('button').classes()).toEqual(
      expect.arrayContaining(['m-button--color-primary', 'm-button--variant-solid']),
    )
  })
})
