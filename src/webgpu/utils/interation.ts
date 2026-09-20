import { unlockBgm } from './audio.js'

export type State = {
  isDragging: boolean
  rotationY: number
  velocity: number
  lastX: number
  isAnimating: boolean
  isPressing: boolean
}

export function createInteractionState(canvas: HTMLCanvasElement) {
  const state: State = {
    isDragging: false,
    rotationY: 0,
    velocity: 0,
    lastX: 0,
    isAnimating: true,
    isPressing: false,
  }

  const handleDown = (clientX: number) => {
    unlockBgm()
    state.isDragging = true
    state.isPressing = true
    state.lastX = clientX
  }

  const handleMove = (clientX: number) => {
    if (!state.isDragging) return

    const deltaX = clientX - state.lastX
    state.rotationY += deltaX * 0.01
    state.velocity = deltaX * 0.02
    state.lastX = clientX
  }

  const handleUp = () => {
    state.isDragging = false
    state.isPressing = false
  }

  canvas.addEventListener('mousedown', (e) => handleDown(e.clientX))
  canvas.addEventListener('mousemove', (e) => handleMove(e.clientX))
  canvas.addEventListener('mouseup', handleUp)
  canvas.addEventListener('mouseleave', handleUp)

  canvas.addEventListener('touchstart', (e) => handleDown(e.touches[0].clientX))
  canvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    },
    { passive: false },
  )
  canvas.addEventListener('touchend', handleUp)

  return state
}
