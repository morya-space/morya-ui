import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MQRCode from './QRCode.vue'
import { encodeQrMatrix } from './qrEncoder'

describe('muQRCode', () => {
  it('encodes value to a square matrix', () => {
    const { matrix, size } = encodeQrMatrix('https://morya-ui.dev', 'M')
    expect(size).toBeGreaterThan(0)
    expect(matrix.length).toBe(size)
    expect(matrix[0].length).toBe(size)
  })

  it('renders canvas and bordered shell', async () => {
    const wrapper = mount(MQRCode, {
      props: { value: 'hello', size: 120, bordered: true },
    })
    await nextTick()
    expect(wrapper.classes()).toContain('m-qrcode--bordered')
    expect(wrapper.find('canvas.m-qrcode__canvas').exists()).toBe(true)
  })

  it('emits refresh when expired overlay button clicked', async () => {
    const wrapper = mount(MQRCode, {
      props: { value: 'x', status: 'expired' },
    })
    await nextTick()
    const button = wrapper.find('.m-qrcode__mask button')
    expect(button.exists()).toBe(true)
    await button.trigger('click')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
  })

  it('renders statusRender slot instead of default mask', () => {
    const wrapper = mount(MQRCode, {
      props: { value: 'x', status: 'expired' },
      slots: {
        statusRender: '<p class="custom-status">Custom</p>',
      },
    })
    expect(wrapper.find('.custom-status').text()).toBe('Custom')
    expect(wrapper.find('.m-qrcode__status-text').exists()).toBe(false)
  })

  it('shows scanned status text', () => {
    const wrapper = mount(MQRCode, {
      props: { value: 'x', status: 'scanned' },
    })
    expect(wrapper.find('.m-qrcode--scanned').exists()).toBe(true)
    expect(wrapper.find('.m-qrcode__status-text').exists()).toBe(true)
  })
})
