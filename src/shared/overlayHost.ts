import { createVNode, render, type AppContext, type Component } from 'vue'

let appContext: AppContext | undefined

/** Keep overlay hosts inside the same app context (locale / config inject). */
export function setWiOverlayAppContext(context: AppContext | null | undefined) {
  appContext = context ?? undefined
}

export function getWiOverlayAppContext() {
  return appContext
}

export interface OverlayHostHandle {
  container: HTMLElement
  unmount: () => void
}

/** Mount a teleport host under `document.body` with the shared app context. */
export function mountOverlayHost(component: Component, className: string): OverlayHostHandle {
  const container = document.createElement('div')
  container.className = className
  document.body.appendChild(container)
  const vnode = createVNode(component)
  if (appContext) vnode.appContext = appContext
  render(vnode, container)
  return {
    container,
    unmount: () => {
      render(null, container)
      container.remove()
    },
  }
}
