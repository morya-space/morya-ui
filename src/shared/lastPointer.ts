const point = { x: 0, y: 0 }
let listening = false

function rememberPoint(event: PointerEvent | MouseEvent) {
  point.x = event.clientX
  point.y = event.clientY
}

/** Track the latest pointer so overlays can zoom from the click. */
export function trackLastPointer() {
  if (listening || typeof window === 'undefined') return
  listening = true
  point.x = window.innerWidth / 2
  point.y = window.innerHeight / 2
  window.addEventListener('pointerdown', rememberPoint, true)
  window.addEventListener('mousedown', rememberPoint, true)
}

export function setLastPointer(x: number, y: number) {
  trackLastPointer()
  point.x = x
  point.y = y
}

export function getLastPointer() {
  trackLastPointer()
  return { x: point.x, y: point.y }
}

if (typeof window !== 'undefined') trackLastPointer()
