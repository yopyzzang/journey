import type { SceneGraphNode } from '../utils/scene-graph.js'
import type { createInteractionState } from '../utils/interation.js'
import type { TRS } from '../utils/TRS.js'
import { lerp, smoothstep } from './common.js'
import { updateBgm } from '../utils/audio.js'

const HOP_SPEED = 2.0
const JUMP_HEIGHT = 3.0
const Z_DISTANCE_PER_HOP = 5.0
const HOP_AIR_FRACTION = 0.8
const NODE_TIME_STAGGER = 0.1
const MAX_DT = 0.05
const FALLBACK_DT = 0.016
const INTRO_SUBTITLE_DURATION = 0.5

const WEATHER_ZONE = {
  SNOW_START: -30,
  SNOW_END: -330,
  RAIN_START: -450,
  RAIN_END: -680,
} as const

const SNOW_FALL_SPEED = 0.05
const SNOW_WRAP_Y = -200
const SNOW_RESET_Y = -50
const SNOW_FOLLOW_SNAP_DISTANCE = 50
const SNOW_FOLLOW_LERP = 0.05
const SNOW_IDLE_JITTER_THRESHOLD_Y = -10
const SNOW_IDLE_JITTER_RANGE = 0.2

const RAIN_RAMP_DURATION = 3.0
const RAIN_MAX_SPEED = 120.0
const RAIN_WRAP_Y = -3500
const RAIN_RESET_Y = -500
const RAIN_FADE_OUT_RATE = 0.0002
const RAIN_FADE_TARGET_SCALE = 0.001

const CLOUD_TARGET_SCALE = 1.0
const CLOUD_FADE_IN_RATE = 0.001
const CLOUD_TARGET_Y = 500
const CLOUD_RISE_RATE = 0.005
const CLOUD_SWAY_AMPLITUDE = 10

const SUN_FADE_IN_RATE = 0.0002
const LEAF_REAPPEAR_DURATION = 15.0
const LEAF_HOVER_HEIGHT = 15.0
const LEAF_LEAD_DISTANCE = 200.0
const LEAF_TARGET_Z_OFFSET = 20
const LEAF_SPIN_SPEED = 0.2

const CHARGE_REQUIRED_TIME = 3.0
const JUMP_DURATION = 1.5
const JUMP_GRAB_START = 0.25
const JUMP_GRAB_END = 0.35
const FAIL_FEEDBACK_DURATION = 2.0

const SHAKE_DURATION = 2.0
const CLIMB_SPEED_Y = 5
const CLIMB_SPEED_Z = 25
const CLIMB_MAX_HEIGHT = 35
const FLY_ROTATION_SPEED = 20
const SUN_GROW_RATE_AFTER_COMBINE = 0.002
const SUN_END_SCALE = 3.5
const BODY_SCALE = 0.0002

const subtitleDiv = document.getElementById('subtitle')
const fadeDiv = document.getElementById('fade-out')
const creditsDiv = document.getElementById('credits')

type ReunionPhase =
  | 'approaching' // 이파리 지점 도달 전 (hop 계속)
  | 'awaiting-release' // 도착함, 첫 클릭 기다리는 중
  | 'charging' // 클릭 유지로 점프 준비 중
  | 'jumping' // 점프 & 합체 애니메이션 재생 중
  | 'combined' // 합체 완료 — 회전 제스처로 최종 비행 대기/진행

const timing = {
  virtualMoveTime: 0,
  lastCallTime: -1,
  wasAnyNodeActive: false,
}

const weather = {
  snowFinished: false,
  rainFinished: false,
  rainStartTime: -1,
}

const reunion = {
  phase: 'approaching' as ReunionPhase,
  leafReappearStartTime: -1,
  leafFixedZ: 0,
  chargeStartTime: -1,
  wasPressing: false,
  failFeedbackUntil: 0,
  jumpStartTime: -1,
  jumpStartZ: 0,
  flyStartTime: -1,
}

function updateHop(node: SceneGraphNode, index: number, moveTime: number) {
  const source = node.children[0].source as TRS

  const nodeTime = Math.max(0, moveTime - index * NODE_TIME_STAGGER)
  const nodeCycle = nodeTime * HOP_SPEED
  const cycleCount = Math.floor(nodeCycle)
  const fraction = nodeCycle % 1.0

  const isActive = nodeCycle > 0 && fraction > 0.01 && fraction < 0.99

  let y = 0
  let scaleY = 1.0
  let scaleXZ = 1.0
  let zOffset = 0

  if (fraction < HOP_AIR_FRACTION) {
    const jumpP = fraction / HOP_AIR_FRACTION
    const jumpArc = Math.sin(jumpP * Math.PI)

    y = lerp(0, JUMP_HEIGHT, jumpArc)
    scaleY = lerp(1.0, 1.2, jumpArc)
    scaleXZ = lerp(1.0, 0.9, jumpArc)
    zOffset = jumpP * Z_DISTANCE_PER_HOP
  } else {
    const squashP = (fraction - HOP_AIR_FRACTION) / (1.0 - HOP_AIR_FRACTION)
    const squashArc = Math.sin(squashP * Math.PI)

    scaleY = lerp(1.0, 0.5, squashArc)
    scaleXZ = lerp(1.0, 1.3, squashArc)
    zOffset = Z_DISTANCE_PER_HOP
  }

  source.translation[1] = y
  source.translation[2] = -(cycleCount * Z_DISTANCE_PER_HOP + zOffset)
  source.scale[0] = scaleXZ
  source.scale[1] = scaleY
  source.scale[2] = scaleXZ

  return { worldZ: source.translation[2], isActive }
}

function updateSnow(
  snowNode: SceneGraphNode,
  worldZ: number,
  isRunning: boolean,
  bodySource: TRS,
) {
  if (worldZ >= WEATHER_ZONE.SNOW_START) return

  const snowSource = snowNode.source as TRS

  if (worldZ < WEATHER_ZONE.SNOW_END) {
    weather.snowFinished = true
    return
  }

  if (
    Math.abs(worldZ - snowSource.translation[2]) > SNOW_FOLLOW_SNAP_DISTANCE
  ) {
    snowSource.translation[2] = worldZ
  } else {
    snowSource.translation[2] +=
      (worldZ - snowSource.translation[2]) * SNOW_FOLLOW_LERP
  }

  snowSource.translation[1] -= SNOW_FALL_SPEED
  if (snowSource.translation[1] < SNOW_WRAP_Y) {
    snowSource.translation[1] = SNOW_RESET_Y
  }

  if (!isRunning && snowSource.translation[1] <= SNOW_IDLE_JITTER_THRESHOLD_Y) {
    bodySource.translation[0] = (Math.random() - 0.5) * SNOW_IDLE_JITTER_RANGE
    bodySource.translation[1] = (Math.random() - 0.5) * SNOW_IDLE_JITTER_RANGE
  }
}

function updateRainAndCloud(
  cloudNode: SceneGraphNode,
  rainNode: SceneGraphNode,
  worldZ: number,
  time: number,
  dt: number,
) {
  if (!weather.snowFinished) return
  if (worldZ > WEATHER_ZONE.RAIN_START) return

  const cloudSource = cloudNode.source as TRS
  const rainSource = rainNode.source as TRS

  if (worldZ < WEATHER_ZONE.RAIN_END) {
    weather.rainFinished = true
    rainSource.scale[1] +=
      (RAIN_FADE_TARGET_SCALE - rainSource.scale[1]) * RAIN_FADE_OUT_RATE
    cloudSource.scale[0] +=
      (RAIN_FADE_TARGET_SCALE - cloudSource.scale[0]) * RAIN_FADE_OUT_RATE
    cloudSource.scale[1] +=
      (RAIN_FADE_TARGET_SCALE - cloudSource.scale[1]) * RAIN_FADE_OUT_RATE
    cloudSource.scale[2] +=
      (RAIN_FADE_TARGET_SCALE - cloudSource.scale[2]) * RAIN_FADE_OUT_RATE
    return
  }

  cloudSource.scale[0] +=
    (CLOUD_TARGET_SCALE - cloudSource.scale[0]) * CLOUD_FADE_IN_RATE
  cloudSource.scale[1] +=
    (CLOUD_TARGET_SCALE - cloudSource.scale[1]) * CLOUD_FADE_IN_RATE
  cloudSource.scale[2] +=
    (CLOUD_TARGET_SCALE - cloudSource.scale[2]) * CLOUD_FADE_IN_RATE
  cloudSource.translation[0] = Math.sin(time * 0.001) * CLOUD_SWAY_AMPLITUDE
  cloudSource.translation[1] +=
    (CLOUD_TARGET_Y - cloudSource.translation[1]) * CLOUD_RISE_RATE

  if (weather.rainStartTime === -1) {
    weather.rainStartTime = time
  }
  const elapsed = time - weather.rainStartTime
  const rampT = Math.min(elapsed / RAIN_RAMP_DURATION, 1.0)
  const eased = rampT * (2 - rampT)
  rainSource.translation[1] -= RAIN_MAX_SPEED * eased * dt

  if (rainSource.translation[1] < RAIN_WRAP_Y) {
    rainSource.translation[1] = RAIN_RESET_Y
  }
}

function updateHoveringLeaf(leafSource: TRS, bodyZ: number, time: number) {
  if (reunion.leafReappearStartTime === -1) {
    reunion.leafReappearStartTime = time
    reunion.leafFixedZ = bodyZ - LEAF_LEAD_DISTANCE
  }
  const elapsed = time - reunion.leafReappearStartTime
  const t = Math.min(elapsed / LEAF_REAPPEAR_DURATION, 1.0)
  const eased = t * (2 - t)

  leafSource.rotation[1] += LEAF_SPIN_SPEED
  leafSource.translation[0] = 0
  leafSource.translation[1] = LEAF_HOVER_HEIGHT
  leafSource.translation[2] = reunion.leafFixedZ
  leafSource.scale = [eased, eased, eased]
}

function updateCharging(
  bodySource: TRS,
  interaction: ReturnType<typeof createInteractionState>,
  time: number,
) {
  if (interaction.isPressing) {
    if (reunion.chargeStartTime === -1) {
      reunion.chargeStartTime = time
    }

    const chargeElapsed = time - reunion.chargeStartTime
    const chargeRatio = Math.min(chargeElapsed / CHARGE_REQUIRED_TIME, 1.0)

    bodySource.scale[1] = 1.0 - chargeRatio * 0.2
    bodySource.scale[0] = 1.0 + chargeRatio * 0.1
    bodySource.scale[2] = 1.0 + chargeRatio * 0.1
    bodySource.translation[0] = (Math.random() - 0.5) * (chargeRatio * 0.25)
  } else {
    if (reunion.wasPressing) {
      const chargeElapsed = time - reunion.chargeStartTime
      const isCharged = chargeElapsed >= CHARGE_REQUIRED_TIME

      if (isCharged) {
        reunion.phase = 'jumping'
        reunion.jumpStartTime = time
        reunion.jumpStartZ = bodySource.translation[2]
        bodySource.translation[0] = 0
      } else {
        reunion.failFeedbackUntil = time + FAIL_FEEDBACK_DURATION
        reunion.chargeStartTime = -1
        bodySource.translation[0] = 0
      }
    }

    bodySource.scale[0] += (1.0 - bodySource.scale[0]) * 0.15
    bodySource.scale[1] += (1.0 - bodySource.scale[1]) * 0.15
    bodySource.scale[2] += (1.0 - bodySource.scale[2]) * 0.15
  }

  reunion.wasPressing = interaction.isPressing
}

function updateJump(bodySource: TRS, leafSource: TRS, time: number) {
  const jumpProgress = Math.min(
    (time - reunion.jumpStartTime) / JUMP_DURATION,
    1.0,
  )
  const arc = Math.sin(jumpProgress * Math.PI)
  const release = 1.0 - jumpProgress
  const scaleXZ = 1.0 + 0.1 * release - 0.1 * arc
  const scaleY = 1.0 - 0.2 * release + 0.25 * arc

  bodySource.translation[1] = arc * LEAF_HOVER_HEIGHT
  bodySource.translation[2] = lerp(
    reunion.jumpStartZ,
    reunion.leafFixedZ,
    jumpProgress,
  )
  bodySource.scale[0] = scaleXZ
  bodySource.scale[1] = scaleY
  bodySource.scale[2] = scaleXZ

  const grabT = smoothstep(JUMP_GRAB_START, JUMP_GRAB_END, jumpProgress)
  leafSource.translation[0] = lerp(0, bodySource.translation[0], grabT)
  leafSource.translation[1] = lerp(
    LEAF_HOVER_HEIGHT,
    bodySource.translation[1],
    grabT,
  )
  leafSource.translation[2] = lerp(
    reunion.leafFixedZ,
    bodySource.translation[2],
    grabT,
  )
  leafSource.scale[0] = lerp(1.0, bodySource.scale[0], grabT)
  leafSource.scale[1] = lerp(1.0, bodySource.scale[1], grabT)
  leafSource.scale[2] = lerp(1.0, bodySource.scale[2], grabT)
  leafSource.rotation[1] += LEAF_SPIN_SPEED * (1 - grabT)

  if (jumpProgress >= 1.0) {
    reunion.phase = 'combined'

    bodySource.translation[1] = 0
    bodySource.translation[2] = reunion.leafFixedZ
    bodySource.scale = [1, 1, 1]

    leafSource.translation[0] = bodySource.translation[0]
    leafSource.translation[1] = 0
    leafSource.translation[2] = reunion.leafFixedZ
    leafSource.scale = [1, 1, 1]
  }
}

function updateCombinedFlight(
  bodySource: TRS,
  leafSource: TRS,
  sunSource: TRS,
  time: number,
  interaction: ReturnType<typeof createInteractionState>,
  state: { isEnded: boolean },
  rotationThreshold: number,
) {
  interaction.velocity *= 0.95
  interaction.rotationY += interaction.velocity
  const absRotation = Math.abs(interaction.rotationY)

  if (reunion.flyStartTime === -1) {
    if (absRotation > rotationThreshold) {
      reunion.flyStartTime = time
    }
  }

  const elapsed = time - reunion.flyStartTime
  const rotationY =
    interaction.rotationY +
    elapsed * FLY_ROTATION_SPEED * Math.sign(interaction.rotationY)

  if (reunion.flyStartTime === -1) {
    bodySource.rotation[1] = interaction.rotationY
    leafSource.rotation[1] = interaction.rotationY
    return
  }

  if (elapsed < SHAKE_DURATION) {
    const shakeIntensity = 0.4 * (elapsed / SHAKE_DURATION)
    const shake = (Math.random() - 0.4) * shakeIntensity

    bodySource.rotation[1] = rotationY
    bodySource.translation[0] = shake
    bodySource.translation[1] = shake

    leafSource.rotation[1] = rotationY
    leafSource.translation[0] = shake
    leafSource.translation[1] = shake
    return
  }

  const flightElapsed = elapsed - SHAKE_DURATION
  const translationY = Math.min(CLIMB_MAX_HEIGHT, flightElapsed * CLIMB_SPEED_Y)
  const translationZ = reunion.leafFixedZ - flightElapsed * CLIMB_SPEED_Z

  if (sunSource.scale[0] <= SUN_END_SCALE) {
    sunSource.scale[0] += SUN_GROW_RATE_AFTER_COMBINE
    sunSource.scale[1] += SUN_GROW_RATE_AFTER_COMBINE
    sunSource.scale[2] += SUN_GROW_RATE_AFTER_COMBINE

    bodySource.scale[0] -= BODY_SCALE
    bodySource.scale[1] -= BODY_SCALE
    bodySource.scale[2] -= BODY_SCALE

    leafSource.scale[0] -= BODY_SCALE
    leafSource.scale[1] -= BODY_SCALE
    leafSource.scale[2] -= BODY_SCALE
  }

  if (leafSource.scale[0] <= 0.8) {
    fadeDiv.style.opacity = '1'
    fadeDiv.style.pointerEvents = 'initial'
    creditsDiv.style.opacity = '1'
    state.isEnded = true
    return
  }

  bodySource.rotation[1] = rotationY
  bodySource.translation[1] = translationY
  bodySource.translation[2] = translationZ

  leafSource.rotation[1] = rotationY
  leafSource.translation[1] = translationY
  leafSource.translation[2] = translationZ
}

function updateSubtitle(
  interaction: ReturnType<typeof createInteractionState>,
  time: number,
) {
  if (!subtitleDiv) return

  switch (reunion.phase) {
    case 'awaiting-release':
      subtitleDiv.innerHTML =
        '드디어 찾았어요.<br>화면을 길게 눌러 높이 점프해봐요!'
      return
    case 'charging': {
      if (interaction.isPressing) {
        const chargeElapsed = time - reunion.chargeStartTime
        const isCharged = chargeElapsed >= CHARGE_REQUIRED_TIME
        subtitleDiv.innerHTML = isCharged
          ? '지금이에요!'
          : `높이 뛸 준비 중.. (${Math.min(100, Math.floor((chargeElapsed / CHARGE_REQUIRED_TIME) * 100))}%)`
      } else if (time < reunion.failFeedbackUntil) {
        subtitleDiv.innerHTML = '조금 더 길게 눌러야 해요!'
      } else {
        subtitleDiv.innerHTML =
          '드디어 찾았어요.<br>화면을 길게 눌러 높이 점프해봐요!'
      }
      return
    }
    case 'jumping':
      subtitleDiv.innerHTML = ''
      return
    case 'combined':
      subtitleDiv.innerHTML =
        reunion.flyStartTime === -1 ? '다시 당근을 돌려볼까요?' : ''
      return
  }
}

function updateSunAndLeaf(
  node: SceneGraphNode,
  sunNode: SceneGraphNode,
  worldZ: number,
  time: number,
  interaction: ReturnType<typeof createInteractionState>,
  state: { isEnded: boolean },
  rotationThreshold: number,
) {
  if (!weather.rainFinished) return

  const bodySource = node.children[0].source as TRS
  const leafSource = node.children[1].source as TRS
  const sunSource = sunNode.source as TRS
  const bodyZ = worldZ - LEAF_TARGET_Z_OFFSET

  sunSource.scale[0] += (1.0 - sunSource.scale[0]) * SUN_FADE_IN_RATE
  sunSource.scale[1] += (1.0 - sunSource.scale[1]) * SUN_FADE_IN_RATE
  sunSource.scale[2] += (1.0 - sunSource.scale[2]) * SUN_FADE_IN_RATE

  if (reunion.phase !== 'jumping' && reunion.phase !== 'combined') {
    updateHoveringLeaf(leafSource, bodyZ, time)
  }

  if (reunion.phase === 'approaching' && bodyZ <= reunion.leafFixedZ) {
    reunion.phase = 'awaiting-release'
  }

  switch (reunion.phase) {
    case 'approaching':
      break
    case 'awaiting-release':
      if (!interaction.isPressing) {
        reunion.phase = 'charging'
      }
      reunion.wasPressing = interaction.isPressing
      break
    case 'charging':
      updateCharging(bodySource, interaction, time)
      break
    case 'jumping':
      updateJump(bodySource, leafSource, time)
      break
    case 'combined':
      updateCombinedFlight(
        bodySource,
        leafSource,
        sunSource,
        time,
        interaction,
        state,
        rotationThreshold,
      )
      break
  }

  updateSubtitle(interaction, time)
}

export function move(
  animNodes: SceneGraphNode[],
  time: number,
  interaction: ReturnType<typeof createInteractionState>,
  snowNode: SceneGraphNode,
  cloudNode: SceneGraphNode,
  rainNode: SceneGraphNode,
  sunNode: SceneGraphNode,
  state: { isEnded: boolean },
  roationThreshold: number,
) {
  const isApproaching = reunion.phase === 'approaching'
  const isRunning =
    (interaction.isPressing || timing.wasAnyNodeActive) && isApproaching

  if (subtitleDiv) {
    subtitleDiv.innerHTML =
      timing.virtualMoveTime <= INTRO_SUBTITLE_DURATION
        ? '화면을 누르고 있으면 이동해요.\n잃어버린 것을 찾으러가요!'
        : ''
  }

  let dt = timing.lastCallTime !== -1 ? time - timing.lastCallTime : 0
  if (dt > MAX_DT || dt < 0) dt = FALLBACK_DT
  timing.lastCallTime = time

  if (isRunning) {
    timing.virtualMoveTime += dt
  } else {
    const currentCycle = timing.virtualMoveTime * HOP_SPEED
    timing.virtualMoveTime = Math.round(currentCycle) / HOP_SPEED
  }

  let isAnyNodeActiveThisFrame = false

  animNodes.forEach((node, i) => {
    let worldZ: number

    if (isApproaching) {
      const hopResult = updateHop(node, i, timing.virtualMoveTime)
      worldZ = hopResult.worldZ
      if (hopResult.isActive) isAnyNodeActiveThisFrame = true
    } else {
      worldZ = (node.children[0].source as TRS).translation[2]
    }

    if (i === 0) {
      if (worldZ < WEATHER_ZONE.SNOW_START) updateBgm(dt)
      updateSnow(snowNode, worldZ, isRunning, node.children[0].source as TRS)
      updateRainAndCloud(cloudNode, rainNode, worldZ, time, dt)
      updateSunAndLeaf(
        node,
        sunNode,
        worldZ,
        time,
        interaction,
        state,
        roationThreshold,
      )
    }
  })

  timing.wasAnyNodeActive = isAnyNodeActiveThisFrame
}
