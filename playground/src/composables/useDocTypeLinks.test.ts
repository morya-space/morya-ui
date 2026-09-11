import { describe, expect, it } from 'vitest'
import { enhanceDocTypeLinks } from '../utils/docTypeLinks'

describe('enhanceDocTypeLinks', () => {
  it('links PascalCase types in Props table to local h4 anchors', () => {
    const root = document.createElement('div')
    root.className = 'm-markdown-doc'
    root.innerHTML = `
      <h4 id="DropdownItem">DropdownItem</h4>
      <h2>Props</h2>
      <table>
        <tbody>
          <tr>
            <td><code>items</code></td>
            <td><code>DropdownItem[]</code></td>
            <td>—</td>
            <td>Menu items</td>
          </tr>
        </tbody>
      </table>
    `

    enhanceDocTypeLinks(root)

    const link = root.querySelector('a.m-doc-type-link')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('href')).toBe('#DropdownItem')
    expect(link?.textContent).toBe('DropdownItem')
  })

  it('links shared types to /docs/types when no local anchor exists', () => {
    const root = document.createElement('div')
    root.className = 'm-markdown-doc'
    root.innerHTML = `
      <h2>Props</h2>
      <table>
        <tbody>
          <tr>
            <td><code>pt</code></td>
            <td><code>RootPassThrough</code></td>
            <td>—</td>
            <td>Pass-through</td>
          </tr>
        </tbody>
      </table>
    `

    enhanceDocTypeLinks(root)

    const link = root.querySelector('a.m-doc-type-link')
    expect(link?.getAttribute('href')).toBe('/docs/types#RootPassThrough')
  })
})
