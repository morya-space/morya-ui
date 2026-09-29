import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MAnchor from './Anchor.vue'
import MAnchorLink from './AnchorLink.vue'

describe('muAnchor', () => {
  it('renders items and active link class on click', async () => {
    document.body.innerHTML = `
      <div id="part-a" style="height:200px"></div>
      <div id="part-b" style="height:200px"></div>
    `
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)

    const wrapper = mount(MAnchor, {
      props: {
        affix: false,
        items: [
          { href: '#part-a', title: 'Part A' },
          { href: '#part-b', title: 'Part B' },
        ],
      },
      attachTo: document.body,
    })

    expect(wrapper.findAll('.m-anchor__link')).toHaveLength(2)
    await wrapper.findAll('.m-anchor__link')[1].trigger('click')
    expect(wrapper.find('.m-anchor__link--active').text()).toContain('Part B')
    wrapper.unmount()
  })

  it('registers MAnchorLink children', () => {
    const wrapper = mount(MAnchor, {
      props: { affix: false },
      slots: {
        default: `
          <MAnchorLink href="#one" title="One" />
          <MAnchorLink href="#two" title="Two" />
        `,
      },
      global: {
        components: { MAnchorLink },
      },
    })
    expect(wrapper.findAll('.m-anchor__link')).toHaveLength(2)
  })

  it('applies horizontal direction class', () => {
    const wrapper = mount(MAnchor, {
      props: { direction: 'horizontal', affix: false, items: [{ href: '#x', title: 'X' }] },
    })
    expect(wrapper.classes()).toContain('m-anchor--horizontal')
  })
})
