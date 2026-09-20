import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createMoryaUI, M_CONFIG_KEY } from '../../shared/config'
import { vLoading } from './directive'
import { loading, resetLoadingService } from './loading'
import MLoading from './Loading.vue'
import { useLoading } from './useLoading'

async function flushLeave() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 220))
  await nextTick()
}

describe('mLoading', () => {
  beforeEach(() => {
    document.documentElement.dataset.mMotion = 'none'
  })

  afterEach(() => {
    resetLoadingService()
    document.body.querySelectorAll('.m-loading-mask').forEach((node) => node.remove())
    document.body.querySelectorAll('.m-loading-parent--relative').forEach((node) => {
      node.classList.remove('m-loading-parent--relative')
      node.removeAttribute('aria-busy')
    })
    document.body.style.overflow = ''
    delete document.documentElement.dataset.mMotion
  })

  it('renders the circular indicator without a caption', () => {
    const wrapper = mount(MLoading)
    expect(wrapper.classes()).toContain('m-loading-indicator')
    expect(wrapper.find('.m-loading-circular__path').exists()).toBe(true)
    expect(wrapper.find('.m-loading-indicator__tip').exists()).toBe(false)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('加载中')
  })

  it('renders each effect and an optional caption', () => {
    const effects = ['aurora', 'bounce', 'wave', 'pulse', 'stardust'] as const
    for (const effect of effects) {
      const wrapper = mount(MLoading, { props: { effect, text: '加载中', size: 'small' } })
      expect(wrapper.find(`.m-loading-${effect}`).exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-loading-indicator--small')
      expect(wrapper.get('.m-loading-indicator__tip').text()).toBe('加载中')
      expect(wrapper.attributes('aria-label')).toBeUndefined()
    }
  })

  it('falls back to circular for unknown ids', () => {
    const unknown = mount(MLoading, { props: { effect: 'orbit' as 'circular' } })
    expect(unknown.find('.m-loading-circular').exists()).toBe(true)
  })

  it('covers slotted content only while loading', async () => {
    const wrapper = mount(MLoading, {
      props: { loading: true, text: '保存中', effect: 'wave' },
      slots: { default: '<button type="button">保存</button>' },
    })
    expect(wrapper.find('.m-loading').exists()).toBe(true)
    expect(wrapper.get('.m-loading').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.m-loading__content').attributes('inert')).toBeDefined()
    expect(wrapper.get('.m-loading-mask').text()).toContain('保存中')
    expect(wrapper.find('.m-loading-wave').exists()).toBe(true)

    await wrapper.setProps({ loading: false })
    await flushLeave()
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)
    expect(wrapper.get('.m-loading__content').attributes('inert')).toBeUndefined()
    expect(wrapper.get('.m-loading').attributes('aria-busy')).toBeUndefined()
  })

  it('delays showing the overlay', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MLoading, {
      props: { loading: true, delay: 200, text: '稍后' },
      slots: { default: '<p>内容</p>' },
    })
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)
    await vi.advanceTimersByTimeAsync(200)
    await nextTick()
    expect(wrapper.find('.m-loading-mask').exists()).toBe(true)
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('teleports a fullscreen mask to the document body', async () => {
    const wrapper = mount(MLoading, {
      props: { fullscreen: true, text: '全屏' },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('.m-loading-mask--fullscreen')).toBeTruthy()
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)
    wrapper.unmount()
    await flushLeave()
  })

  it('reads the default effect from component defaults', () => {
    const wrapper = mount(MLoading, {
      global: {
        provide: {
          [M_CONFIG_KEY as symbol]: { componentDefaults: { Loading: { effect: 'pulse' } } },
        },
      },
    })
    expect(wrapper.find('.m-loading-pulse').exists()).toBe(true)
  })

  it('uses the installed default effect for the service', async () => {
    const wrapper = mount(defineComponent({ template: '<div />' }), {
      global: {
        plugins: [createMoryaUI({ componentDefaults: { Loading: { effect: 'stardust' } } })],
      },
    })
    const instance = loading.service({ text: '同步' })
    await nextTick()
    expect(document.body.querySelector('.m-loading-stardust')).toBeTruthy()
    instance.close()
    await flushLeave()
    wrapper.unmount()
  })

  it('opens a fullscreen service mask and updates the caption', async () => {
    const instance = loading.service({ text: '提交中', lock: true })
    await nextTick()
    const mask = document.body.querySelector('.m-loading-mask')
    expect(mask?.classList.contains('m-loading-mask--fullscreen')).toBe(true)
    expect(mask?.textContent).toContain('提交中')
    expect(document.body.style.overflow).toBe('hidden')

    instance.setText('即将完成')
    await nextTick()
    expect(document.body.textContent).toContain('即将完成')

    instance.close()
    await flushLeave()
    expect(document.body.querySelector('.m-loading-mask')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps only one fullscreen service mask', async () => {
    loading.service({ text: '第一个' })
    await nextTick()
    loading.service({ text: '第二个' })
    await nextTick()
    const masks = document.body.querySelectorAll('.m-loading-mask--fullscreen')
    expect(masks).toHaveLength(1)
    expect(masks[0]?.textContent).toContain('第二个')
  })

  it('covers a target element from the service', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const instance = loading.service({ target, text: '局部', effect: 'bounce' })
    await nextTick()
    expect(target.querySelector('.m-loading-bounce')).toBeTruthy()
    expect(target.getAttribute('aria-busy')).toBe('true')
    expect(target.classList.contains('m-loading-parent--relative')).toBe(true)
    instance.close()
    await flushLeave()
    expect(target.querySelector('.m-loading-mask')).toBeNull()
    expect(target.hasAttribute('aria-busy')).toBe(false)
    target.remove()
  })

  it('renders a custom spinner from the service', async () => {
    const instance = loading.service({
      spinner: () => h('strong', { class: 'custom-spinner' }, '定制'),
    })
    await nextTick()
    expect(document.body.querySelector('.custom-spinner')?.textContent).toBe('定制')
    instance.close()
    await flushLeave()
  })

  it('toggles the v-loading directive', async () => {
    const Host = defineComponent({
      directives: { loading: vLoading },
      props: { on: Boolean },
      template: '<div v-loading="on" m-loading-text="保存中" m-loading-effect="wave" class="host">内容</div>',
    })
    const wrapper = mount(Host, { props: { on: false }, attachTo: document.body })
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)

    await wrapper.setProps({ on: true })
    expect(wrapper.get('.host').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('.m-loading-mask').text()).toContain('保存中')
    expect(wrapper.find('.m-loading-wave').exists()).toBe(true)
    expect(wrapper.get('.host').classes()).toContain('m-loading-parent--relative')

    await wrapper.setProps({ on: false })
    await flushLeave()
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)
    expect(wrapper.get('.host').attributes('aria-busy')).toBeUndefined()
    wrapper.unmount()
  })

  it('places a fullscreen directive mask on the document body and locks scrolling', async () => {
    const Host = defineComponent({
      directives: { loading: vLoading },
      template: '<div v-loading.fullscreen.lock="true" class="host">内容</div>',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(document.body.querySelector('.m-loading-mask--fullscreen')).toBeTruthy()
    expect(wrapper.find('.m-loading-mask').exists()).toBe(false)
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.querySelector('.m-loading-mask')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes automatically through useLoading on unmount', async () => {
    const Host = defineComponent({
      setup() {
        const api = useLoading({ text: '自动关闭', lock: true })
        api.open()
        return () => h('div')
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(document.body.querySelector('.m-loading-mask')).toBeTruthy()
    wrapper.unmount()
    await flushLeave()
    expect(document.body.querySelector('.m-loading-mask')).toBeNull()
  })

  it('registers v-loading from the plugin and skips it when components are disabled', async () => {
    const Host = defineComponent({
      template: '<div v-loading="true" class="box">X</div>',
    })
    const enabled = mount(Host, { global: { plugins: [createMoryaUI()] }, attachTo: document.body })
    expect(enabled.find('.m-loading-mask').exists()).toBe(true)

    const disabled = mount(Host, {
      global: { plugins: [createMoryaUI({ components: false })] },
      attachTo: document.body,
    })
    expect(disabled.find('.m-loading-mask').exists()).toBe(false)
    enabled.unmount()
    disabled.unmount()
    await flushLeave()
  })
})
