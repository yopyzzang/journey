import type { SceneGraphNode } from '../utils/scene-graph.js'
import type { createInteractionState } from '../utils/interation.js'
import type { TRS } from '../utils/TRS.js'
import { lerp } from './common.js'
import { SUBTITLE } from '../constants/subtitle.js'

let flyStartTime = -1
let startRotation = 0
let rotationDirection = 1
let currentPhase: FlightPhase | '' = ''

const AUTO_SPIN_SPEED = 20
const LEAF_FLY_SPEED = 60.0
const TIMING = {
  CHARGE: 2.0,
  FLY: 2.5,
  HOVER: 1.5,
  FALL: 1.5,
  BOUNCE: 2.0,
}
const MILESTONE = {
  HOVER_START: TIMING.CHARGE + TIMING.FLY,
  SEPARATE_START: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER,
  BOUNCE_START: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER + TIMING.FALL,
  DONE: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER + TIMING.FALL + TIMING.BOUNCE,
}
type FlightPhase =
  'idle' | 'charge' | 'fly' | 'hover' | 'separate' | 'bounce' | 'done'
const subtitleDiv = document.getElementById('subtitle')

function getFlightPhase(elapsed: number): FlightPhase {
  if (flyStartTime === -1) return 'idle'
  if (elapsed < TIMING.CHARGE) return 'charge'
  if (elapsed < MILESTONE.HOVER_START) return 'fly'
  if (elapsed < MILESTONE.SEPARATE_START) return 'hover'
  if (elapsed < MILESTONE.BOUNCE_START) return 'separate'
  if (elapsed < MILESTONE.DONE) return 'bounce'
  return 'done'
}

function idle(node: SceneGraphNode, rotationY: number) {
  const source = node.source as TRS

  source.rotation[1] = rotationY
}

function charge(elapsed: number, node: SceneGraphNode) {
  const source = node.source as TRS
  const shakeIntensity = 0.4 * (elapsed / TIMING.CHARGE)

  source.rotation[1] =
    startRotation + elapsed * AUTO_SPIN_SPEED * rotationDirection
  source.translation[0] = (Math.random() - 0.4) * shakeIntensity
  source.translation[1] = (Math.random() - 0.4) * shakeIntensity
}

function flight(elapsed: number, node: SceneGraphNode) {
  const source = node.source as TRS
  const flightElapsed = elapsed - TIMING.CHARGE
  const progress = Math.min(1.0, flightElapsed / TIMING.FLY)

  source.rotation[1] =
    startRotation + elapsed * AUTO_SPIN_SPEED * rotationDirection

  source.translation[1] = lerp(0, 20, progress)
  source.translation[2] = lerp(0, -30, progress)
}

function hover(elapsed: number, node: SceneGraphNode) {
  const body = node.children[0].source as TRS
  const leaf = node.children[1].source as TRS
  const hoverElapsed = elapsed - MILESTONE.HOVER_START
  const progress = Math.min(1.0, hoverElapsed / TIMING.HOVER)

  body.rotation[1] = lerp(0, 20, progress)
  leaf.rotation[1] =
    startRotation + elapsed * AUTO_SPIN_SPEED * rotationDirection
}

function leafFlight(elapsed: number, node: SceneGraphNode) {
  const leaf = node.children[1].source as TRS

  const sepElapsed = elapsed - MILESTONE.SEPARATE_START
  const sepRotation =
    startRotation +
    MILESTONE.SEPARATE_START * AUTO_SPIN_SPEED * rotationDirection

  leaf.rotation[1] =
    sepRotation + sepElapsed * AUTO_SPIN_SPEED * rotationDirection
  leaf.translation[1] = lerp(0, 15, sepElapsed)
  leaf.translation[2] = -(sepElapsed * LEAF_FLY_SPEED)

  const FADE_START = -200 // 작아지기 시작하는 위치
  const FADE_END = -400 // 완전히 사라지는 위치

  if (leaf.translation[2] <= FADE_START) {
    const fadeProgress = Math.min(
      1.0,
      (leaf.translation[2] - FADE_START) / (FADE_END - FADE_START),
    )

    const currentScale = 1.0 - fadeProgress
    leaf.scale[0] = currentScale
    leaf.scale[1] = currentScale
    leaf.scale[2] = currentScale
  } else {
    leaf.scale[0] = 1
    leaf.scale[1] = 1
    leaf.scale[2] = 1
  }
}

function separate(elapsed: number, node: SceneGraphNode) {
  const source = node.source as TRS
  const body = node.children[0].source as TRS

  const sepElapsed = elapsed - MILESTONE.SEPARATE_START
  const progress = Math.min(1.0, sepElapsed / TIMING.FALL) // 추락 진행률

  const sepRotation =
    startRotation +
    MILESTONE.SEPARATE_START * AUTO_SPIN_SPEED * rotationDirection

  source.translation[1] = 20
  source.translation[2] = -30
  source.rotation[1] = 0

  leafFlight(elapsed, node)

  const gravity = Math.pow(progress, 2)
  body.translation[1] = lerp(0, -20, gravity)
  body.translation[2] = lerp(0, 30, progress)

  const spinSlowDown = 1 - Math.pow(1 - progress, 2)
  const extraSpin = Math.PI * 6 * rotationDirection
  body.rotation[1] = sepRotation + extraSpin * spinSlowDown
}

function bounce(elapsed: number, node: SceneGraphNode) {
  leafFlight(elapsed, node)

  const body = node.children[0].source as TRS
  const bounceElapsed = elapsed - MILESTONE.BOUNCE_START
  const progress = Math.min(1.0, bounceElapsed / TIMING.BOUNCE) // 튕기기 진행률

  const dampening = Math.pow(1 - progress, 2) // 튕기는 힘 감소
  const bounceArc = Math.abs(Math.sin(progress * Math.PI * 3)) // 3번 바운스
  const bounceY = bounceArc * 6.0 * dampening

  const maxSquash = 1.0 - 0.4 * dampening
  const squashY = lerp(maxSquash, 1.0, Math.min(1.0, bounceArc * 2.0))
  const stretchXZ = 1.0 + (1.0 - squashY) * 0.5

  body.translation[1] = -20 + bounceY
  body.translation[2] = 30
  body.scale[0] = stretchXZ
  body.scale[1] = squashY
  body.scale[2] = stretchXZ
}

function done(
  elapsed: number,
  node: SceneGraphNode,
  interaction: ReturnType<typeof createInteractionState>,
) {
  const source = node.source as TRS
  const leaf = node.children[1].source as TRS
  const body = node.children[0].source as TRS

  leafFlight(elapsed, node)
  if (leaf.scale[0] === 0) {
    interaction.isAnimating = false
    interaction.rotationY = 0

    source.translation[1] = 0
    source.translation[2] = 0
    body.translation[1] = 0
    body.translation[2] = 0
  }
}

export function fly(
  animationNode: SceneGraphNode[],
  time: number,
  interaction: ReturnType<typeof createInteractionState>,
) {
  const absRotation = Math.abs(interaction.rotationY)

  if (absRotation > 80 && flyStartTime === -1) {
    flyStartTime = time
    startRotation = interaction.rotationY
    rotationDirection = Math.sign(interaction.rotationY)
  }

  const elapsed = time - flyStartTime
  const phase = getFlightPhase(elapsed)

  if (currentPhase !== phase) {
    currentPhase = phase

    if (subtitleDiv) {
      subtitleDiv.innerHTML = SUBTITLE[currentPhase] || ''
      // subtitleDiv.style.opacity = phase === 'done' ? '0' : '1'
    }
  }
  animationNode.forEach((node) => {
    switch (phase) {
      case 'idle':
        idle(node, interaction.rotationY)
        break
      case 'charge':
        charge(elapsed, node)
        break
      case 'fly':
        flight(elapsed, node)
        break
      case 'hover':
        hover(elapsed, node)
        break
      case 'separate':
        separate(elapsed, node)
        break
      case 'bounce':
        bounce(elapsed, node)
        break
      default:
        done(elapsed, node, interaction)
        return
    }
  })
}
