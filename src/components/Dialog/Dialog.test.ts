import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { setLastPointer } from '../../shared/lastPointer'
import MDialog from './Dialog.vue'

// The dialog Teleports to `body`; failed assertions would otherwise leak DOM
// into the next test. Clean up aggressively.
afterEach(() => {
  document.body.innerHTML = ''
})

describe('muDialog', () => {
  it('closes with Escape and emits lifecycle events', async () => {
    const wrapper = mount(MDialog, { attachTo: document.body, props: { modelValue: true, title: 'Confirm' } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('show')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports close controls and configurable outside clicks', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Confirm', closeOnOutsideClick: false },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.m-dialog-backdrop')
    const closeButton = document.body.querySelector('.m-dialog__actions .m-dialog__action:last-child')
    expect(backdrop).toBeTruthy()
    expect(closeButton).toBeTruthy()
    backdrop!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    closeButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('supports corner positions', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Corner', position: 'topright' },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog__header h2')?.textContent).toBe('Corner')
    expect(document.body.querySelector('.m-dialog-backdrop--topright')).toBeTruthy()
    wrapper.unmount()
  })

  it('closes on mask click only when closeOnOutsideClick is true', async () => {
    // Default: clicking the mask does not close the dialog.
    const defaultMask = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Default mask' },
    })
    await nextTick()
    document.body.querySelector('.m-dialog-backdrop')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(defaultMask.emitted('close')).toBeUndefined()
    defaultMask.unmount()

    // Opt-in: closeOnOutsideClick closes on mask click. The handler is bound with
    // `@click.self` on `.m-dialog-zoom`, so click the zoom element itself.
    const closableMask = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Closable mask', closeOnOutsideClick: true },
    })
    await nextTick()
    document.body.querySelector('.m-dialog-zoom')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(closableMask.emitted('update:modelValue')).toEqual([[false]])
    expect(closableMask.emitted('close')).toHaveLength(1)
    closableMask.unmount()
  })

  it('toggles maximized state when maximizable', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Workspace', maximizable: true },
    })
    await nextTick()
    const maximizeButton = document.body.querySelector('.m-dialog__action') as HTMLButtonElement
    expect(maximizeButton?.getAttribute('aria-label')).toBe('最大化')
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeTruthy()
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    maximizeButton.click()
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeFalsy()
    expect(wrapper.emitted('unmaximize')).toHaveLength(1)
    wrapper.unmount()
  })

  it('zooms the panel from the last pointer position', async () => {
    setLastPointer(24, 48)
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Zoom' },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.m-dialog-backdrop') as HTMLElement | null
    expect(backdrop?.style.getPropertyValue('--m-dialog-origin-x')).toBe('24px')
    expect(backdrop?.style.getPropertyValue('--m-dialog-origin-y')).toBe('48px')
    wrapper.unmount()
  })

  it('renders a type icon and preset footer actions', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Save', type: 'info', positiveText: '保存', negativeText: '取消' },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog--info')).toBeTruthy()
    expect(document.body.querySelector('.m-dialog__type-icon')).toBeTruthy()
    const labels = Array.from(document.body.querySelectorAll('.m-dialog__footer--preset .m-button')).map(
      (btn) => btn.textContent?.replace(/\s/g, ''),
    )
    expect(labels).toEqual(expect.arrayContaining(['保存', '取消']))
    wrapper.unmount()
  })

  it('keeps the dialog open when beforeClose returns false', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Stay', beforeClose: () => false },
    })
    await nextTick()
    document.body.querySelector('.m-dialog__action')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps the dialog open when onPositiveClick returns false', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: 'Save',
        positiveText: '保存',
        onPositiveClick: () => false,
      },
    })
    await nextTick()
    const positive = Array.from(document.body.querySelectorAll('.m-dialog__footer--preset .m-button')).find((btn) =>
      btn.textContent?.replace(/\s/g, '').includes('保存'),
    )
    positive!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('close')).toBeUndefined()
    wrapper.unmount()
  })

  it('exposes close / maximize / unmaximize', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'API', maximizable: true, ariaLabel: 'Custom dialog label' },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog')?.getAttribute('aria-label')).toBe(
      'Custom dialog label',
    )
    await (wrapper.vm as { close: () => void }).close()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    await (wrapper.vm as { maximize: () => void }).maximize()
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeTruthy()
    await (wrapper.vm as { unmaximize: () => void }).unmaximize()
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeFalsy()
    wrapper.unmount()
  })

  it('applies width prop to the panel', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Sized', width: '28rem' },
    })
    await nextTick()
    const panel = document.body.querySelector('.m-dialog') as HTMLElement
    // Width goes through the `--m-dialog-width` token so the default
    // `max-width` bound tracks the caller-provided size.
    expect(panel.style.getPropertyValue('--m-dialog-width')).toBe('28rem')
    wrapper.unmount()
  })

  it('moves fallthrough style width onto the panel, not the backdrop', async () => {
    const open = ref(true)
    const Host = {
      setup() {
        return () =>
          h(
            MDialog,
            {
              modelValue: open.value,
              'onUpdate:modelValue': (value: boolean) => {
                open.value = value
              },
              title: 'Sized',
              style: { width: '28rem' },
            },
          )
      },
    }
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const backdrop = document.body.querySelector('.m-dialog-backdrop') as HTMLElement
    const panel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(backdrop.style.width).toBe('')
    expect(panel.style.getPropertyValue('--m-dialog-width')).toBe('28rem')
    wrapper.unmount()
  })

  it('applies pass-through attributes to Teleport-safe dialog parts', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        title: 'Customizable',
        pt: {
          root: { class: 'custom-backdrop' },
          zoom: { class: 'custom-zoom' },
          panel: { class: 'custom-panel', style: { backgroundColor: 'rgb(1, 2, 3)' } },
          header: { class: 'custom-header' },
          body: { class: 'custom-body', 'data-testid': 'dialog-body' },
        },
      },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog-backdrop')?.classList.contains('custom-backdrop')).toBe(true)
    expect(document.body.querySelector('.m-dialog-zoom')?.classList.contains('custom-zoom')).toBe(true)
    const panel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(panel.classList.contains('custom-panel')).toBe(true)
    expect(panel.style.backgroundColor).toBe('rgb(1, 2, 3)')
    expect(document.body.querySelector('.m-dialog__header')?.classList.contains('custom-header')).toBe(true)
    expect(document.body.querySelector('[data-testid="dialog-body"]')?.classList.contains('custom-body')).toBe(true)
    wrapper.unmount()
  })

  it('keeps default dialog preset when transition prop is omitted', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Motion' },
    })
    await nextTick()
    expect(wrapper.props('transition')).toBeUndefined()
    const vm = wrapper.vm as unknown as { transitionName: string | undefined; transitionCss: boolean }
    expect(vm.transitionName).toBe('m-zoom')
    expect(vm.transitionCss).toBe(true)
    wrapper.unmount()
  })

  // —— fullscreen ————————————————————————————————————————

  it('supports fullscreen via prop and syncs with the maximize toggle', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Full', fullscreen: true, maximizable: true },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog--fullscreen')).toBeTruthy()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeTruthy()
    expect(document.body.querySelector('.m-dialog-backdrop--maximized')).toBeTruthy()

    // Toggle button should reflect fullscreen state and emit `update:fullscreen`.
    const toggle = document.body.querySelector('.m-dialog__action') as HTMLButtonElement
    expect(toggle.getAttribute('aria-label')).toBe('还原')
    toggle.click()
    await nextTick()
    expect(wrapper.emitted('update:fullscreen')).toEqual([[false]])
    expect(wrapper.emitted('unmaximize')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits update:fullscreen when user toggles maximized', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Sync', maximizable: true },
    })
    await nextTick()
    const toggle = document.body.querySelector('.m-dialog__action') as HTMLButtonElement
    toggle.click()
    await nextTick()
    expect(wrapper.emitted('update:fullscreen')).toEqual([[true]])
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    wrapper.unmount()
  })

  it('reacts to fullscreen prop changes from the parent', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'External', maximizable: true, fullscreen: false },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeFalsy()
    await wrapper.setProps({ fullscreen: true })
    await nextTick()
    expect(document.body.querySelector('.m-dialog--maximized')).toBeTruthy()
    expect(wrapper.emitted('maximize')).toHaveLength(1)
    wrapper.unmount()
  })

  // —— width number / top / zIndex ————————————————————————————

  it('accepts width as a number (treated as px)', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Sized', width: 480 },
    })
    await nextTick()
    const panel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(panel.style.getPropertyValue('--m-dialog-width')).toBe('480px')
    wrapper.unmount()
  })

  it('applies top margin only for top-* positions', async () => {
    const top = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Top', position: 'top', top: '15vh' },
    })
    await nextTick()
    const topPanel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(topPanel.style.getPropertyValue('--m-dialog-top')).toBe('15vh')
    top.unmount()

    const centered = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Centered', top: '15vh' },
    })
    await nextTick()
    const centeredPanel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(centeredPanel.style.getPropertyValue('--m-dialog-top')).toBe('')
    centered.unmount()
  })

  it('applies zIndex to the backdrop', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Stacked', zIndex: 3000 },
    })
    await nextTick()
    const backdrop = document.body.querySelector('.m-dialog-backdrop') as HTMLElement
    expect(backdrop.style.zIndex).toBe('3000')
    wrapper.unmount()
  })

  // —— closeIcon / headerAriaLevel ————————————————————————————

  it('renders a custom close icon', async () => {
    const custom = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Custom', closeIcon: 'warning' },
    })
    await nextTick()
    const customButton = document.body.querySelector(
      '.m-dialog__actions .m-dialog__action:last-child',
    ) as HTMLButtonElement
    const customHtml = customButton.innerHTML
    custom.unmount()
    document.body.innerHTML = ''

    const fallback = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Default' },
    })
    await nextTick()
    const defaultButton = document.body.querySelector(
      '.m-dialog__actions .m-dialog__action:last-child',
    ) as HTMLButtonElement
    // The custom close icon should render different svg markup than the default.
    expect(customHtml).not.toBe(defaultButton.innerHTML)
    fallback.unmount()
  })

  it('applies headerAriaLevel to the title heading', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'A11y', headerAriaLevel: 3 },
    })
    await nextTick()
    const title = document.body.querySelector('.m-dialog__title') as HTMLElement
    expect(title.getAttribute('role')).toBe('heading')
    expect(title.getAttribute('aria-level')).toBe('3')
    wrapper.unmount()
  })

  // —— destroyOnClose ————————————————————————————————————

  it('destroys default slot content on close when destroyOnClose is true', async () => {
    const open = ref(true)
    let mountCount = 0
    let unmountCount = 0
    const Child = {
      template: '<div class="sentinel">hello</div>',
      mounted() {
        mountCount++
      },
      unmounted() {
        unmountCount++
      },
    }
    const Host = {
      components: { MDialog, Child },
      setup: () => () =>
        h(
          MDialog,
          {
            modelValue: open.value,
            'onUpdate:modelValue': (v: boolean) => {
              open.value = v
            },
            title: 'Destroyable',
            destroyOnClose: true,
            transition: false,
          },
          { default: () => h(Child) },
        ),
    }
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(mountCount).toBe(1)
    open.value = false
    await nextTick()
    await nextTick() // let transition after-leave run
    expect(unmountCount).toBe(1)
    open.value = true
    await nextTick()
    expect(mountCount).toBe(2)
    wrapper.unmount()
  })

  // —— openDelay / closeDelay ————————————————————————————

  it('honours openDelay and closeDelay', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: false, title: 'Delayed', openDelay: 30, closeDelay: 30 },
    })
    await nextTick()
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(document.body.querySelector('.m-dialog-backdrop')).toBeFalsy()
    await new Promise((resolve) => setTimeout(resolve, 50))
    await nextTick()
    expect(document.body.querySelector('.m-dialog-backdrop')).toBeTruthy()

    await wrapper.setProps({ modelValue: false })
    await nextTick()
    // Backdrop should still exist until closeDelay expires.
    expect(document.body.querySelector('.m-dialog-backdrop')).toBeTruthy()
    await new Promise((resolve) => setTimeout(resolve, 50))
    await nextTick()
    expect(document.body.querySelector('.m-dialog-backdrop')).toBeFalsy()
    wrapper.unmount()
  })

  // —— draggable ————————————————————————————————————

  it('drags the panel by its header and exposes resetPosition', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Drag', draggable: true, transition: false },
    })
    await nextTick()
    const header = document.body.querySelector('.m-dialog__header') as HTMLElement
    const panel = document.body.querySelector('.m-dialog') as HTMLElement
    expect(document.body.querySelector('.m-dialog-backdrop--draggable')).toBeTruthy()

    header.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 100, clientY: 100 }))
    document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 160, clientY: 140 }))
    // Wait a frame for rAF to apply the transform.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    expect(panel.style.transform).toContain('translate3d(')
    await nextTick()
    // After pointerup the panel should no longer be in the dragging state.
    expect(panel.classList.contains('m-dialog--dragging')).toBe(false)

    // Clicking the close button inside the header must not start a drag.
    const closeBtn = document.body.querySelector(
      '.m-dialog__actions .m-dialog__action:last-child',
    ) as HTMLButtonElement
    closeBtn.dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: 200, clientY: 200 }),
    )
    await nextTick()
    expect(panel.classList.contains('m-dialog--dragging')).toBe(false)

    await (wrapper.vm as { resetPosition: () => void }).resetPosition()
    await nextTick()
    expect(panel.style.transform).toBe('')
    wrapper.unmount()
  })

  it('does not drag when fullscreen', async () => {
    const wrapper = mount(MDialog, {
      attachTo: document.body,
      props: { modelValue: true, title: 'Full', draggable: true, fullscreen: true, transition: false },
    })
    await nextTick()
    expect(document.body.querySelector('.m-dialog-backdrop--draggable')).toBeFalsy()
    expect(document.body.querySelector('.m-dialog--draggable')).toBeFalsy()
    wrapper.unmount()
  })
})
