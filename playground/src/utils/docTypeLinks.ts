import { resolveDocTypeHref, SKIP_DOC_TYPE_NAMES } from '../data/docTypeRegistry'

const READY = 'data-m-type-links'

const API_SECTIONS = /^(props|events|slots|types|类型|属性)$/i

function collectLocalTypeIds(root: HTMLElement): Set<string> {
  const ids = new Set<string>()
  root.querySelectorAll('h3[id], h4[id]').forEach((el) => {
    if (el.id) ids.add(el.id)
  })
  return ids
}

function scrollToAnchor(root: HTMLElement, id: string) {
  const target = root.querySelector(`#${CSS.escape(id)}`)
  if (!target) return
  const container = root.closest('.m-scrollbar__wrap') as HTMLElement | null
  if (container) {
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      88
    container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  history.replaceState(null, '', `#${id}`)
}

function linkifyCodeElement(code: HTMLElement, localIds: Set<string>) {
  const text = code.textContent ?? ''
  const match = text.match(/^([A-Z][A-Za-z0-9]*)(.*)$/)
  if (!match) return

  const [, name, suffix] = match
  if (SKIP_DOC_TYPE_NAMES.has(name)) return
  const href = resolveDocTypeHref(name, localIds)
  if (!href) return

  const anchor = document.createElement('a')
  anchor.className = 'm-doc-type-link'
  anchor.href = href
  anchor.title = name

  const innerCode = document.createElement('code')
  innerCode.textContent = name
  anchor.appendChild(innerCode)

  const parent = code.parentElement
  if (!parent) return
  parent.replaceChild(anchor, code)
  if (suffix) parent.insertBefore(document.createTextNode(suffix), anchor.nextSibling)
}

function linkifyCell(cell: HTMLElement, localIds: Set<string>) {
  if (cell.getAttribute(READY) === '1') return
  if (cell.querySelector('a.m-doc-type-link')) {
    cell.setAttribute(READY, '1')
    return
  }

  cell.querySelectorAll('code').forEach((code) => linkifyCodeElement(code as HTMLElement, localIds))

  cell.setAttribute(READY, '1')
}

function bindAnchorClick(root: HTMLElement, anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href')
  if (!href?.startsWith('#')) return

  anchor.addEventListener('click', (event) => {
    event.preventDefault()
    scrollToAnchor(root, href.slice(1))
  })
}

export function enhanceDocTypeLinks(root: HTMLElement) {
  const localIds = collectLocalTypeIds(root)

  root.querySelectorAll(':scope > h2').forEach((h2) => {
    const title = h2.textContent?.trim() ?? ''
    if (!API_SECTIONS.test(title)) return

    let node = h2.nextElementSibling
    while (node) {
      if (node.tagName === 'H2') break
      if (node.tagName === 'TABLE') {
        node.querySelectorAll('tbody tr').forEach((row) => {
          const cells = row.querySelectorAll('td')
          if (cells.length < 2) return
          linkifyCell(cells[1] as HTMLElement, localIds)
        })
        break
      }
      node = node.nextElementSibling
    }
  })

  root.querySelectorAll('a.m-doc-type-link[href^="#"]').forEach((anchor) => {
    bindAnchorClick(root, anchor as HTMLAnchorElement)
  })
}

export const DOC_TYPE_LINKS_READY_ATTR = READY
