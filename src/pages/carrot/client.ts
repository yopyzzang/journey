import { initWebGPU } from '../../webgpu/core/init'
import { createPipeline } from '../../webgpu/core/pipeline.js'
import { renderer } from '../../webgpu/core/renderer.js'
import { resizeObserver } from '../../webgpu/utils/resize-observer.js'
import {
  addObjectNode,
  addRootObject,
  addTRSSceneGraphNode,
  animNodes,
  createVertices,
  meshes
} from '../../webgpu/utils/object.js'
import { createCarrotLeafVertices, createCarrotVertices } from '../../webgpu/geometry/carrot.js'
import { SceneGraphNode } from '../../webgpu/utils/scene-graph.js'
import { degToRad } from '../../webgpu/utils/math.js'
import { createInteractionState } from '../../webgpu/utils/interation.js'
import { createSnowVertices } from '../../webgpu/geometry/snow.js'
import { createCloudVertices } from '../../webgpu/geometry/cloud.js'
import { createRainVertices } from '../../webgpu/geometry/rain.js'
import { move } from '../../webgpu/animations/move.js'
import { fly } from '../../webgpu/animations/fly.js'
import { createSunVertices } from '../../webgpu/geometry/sun.js'

export type Setting = {
  cameraRotation: number
  cameraTranslationX: number
  cameraTranslationY: number
  cameraTranslationZ: number
  showMeshNodes: boolean
  showAllTRS: boolean
  animate: boolean
}

const settings: Setting = {
  cameraRotation: degToRad(0),
  cameraTranslationX: 0,
  cameraTranslationY: 0,
  cameraTranslationZ: 30,
  showMeshNodes: false,
  showAllTRS: false,
  animate: false,
}

async function main() {
  const { canvas, dpr, context, device, format } = await initWebGPU()
  const { pipeline, sunPipeline, renderPassDescriptor } = await createPipeline(
    device,
    format,
  )
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
  const rainCount = isMobile ? 4000 : 10000
  const snowCount = isMobile ? 5000 : 12000
  const cloudCount = isMobile ? 20 : 40

  resizeObserver(canvas, device, dpr)

  const interaction = createInteractionState(canvas)
  const root = new SceneGraphNode('root', null)

  const carrot = createCarrotVertices()
  const carrotVertices = createVertices('carrot', device, carrot)
  const carrotLeaf = createCarrotLeafVertices()
  const carrotLeafVertices = createVertices('carrot-leaf', device, carrotLeaf)
  addRootObject('carrot', root, 0, carrotVertices, pipeline, carrotLeafVertices)

  const snow = createSnowVertices(snowCount, 100, 300)
  const snowVertices = createVertices('snow', device, snow)
  const snowNode = addTRSSceneGraphNode('snow-root', root, {
    translation: [0, 70, 0],
  })
  addObjectNode(
    'snow-mesh',
    snowNode,
    { scale: [1, 1, 1] },
    snowVertices,
    'default',
    pipeline,
    [1, 1, 1],
  )

  const cloud = createCloudVertices(cloudCount, 4000, 600)
  const cloudVertices = createVertices('cloud', device, cloud)
  const cloudNode = addTRSSceneGraphNode('cloud-root', root, {
    translation: [0, 800, -2000],
    scale: [0, 0, 0],
  })
  addObjectNode(
    'cloud-mesh',
    cloudNode,
    { scale: [1, 1, 1] },
    cloudVertices,
    'default',
    pipeline,
    [1, 1, 1],
  )

  const rain = createRainVertices(rainCount, 1000, 400, 4000)
  const rainVertices = createVertices('rain', device, rain)
  const rainNode = addTRSSceneGraphNode('rain-root', root, {
    translation: [0, 1500, -950],
    scale: [1, 1, 1],
  })
  addObjectNode(
    'rain-mesh',
    rainNode,
    { scale: [1, 1, 1] },
    rainVertices,
    'default',
    pipeline,
    [1, 1, 1],
  )

  const sun = createSunVertices(48, 48)
  const sunVertices = createVertices('sun', device, sun)
  const sunNode = addTRSSceneGraphNode('sun-root', root, {
    translation: [0, 600, -2500],
    scale: [0, 0, 0],
  })
  addObjectNode(
    'sun-mesh',
    sunNode,
    { scale: [9, 9, 9] },
    sunVertices,
    'sun',
    sunPipeline,
    [1, 1, 1],
  )

  let renderRequestId: number | undefined
  let then: number
  let time = 0
  let wasRunning = false
  let state = { isEnded: false }

  function requestRender() {
    if (!renderRequestId) {
      renderRequestId = requestAnimationFrame(render)
    }
  }

  const render = () => {
    renderRequestId = undefined
    // const isRunning = settings.animate
    const isRunning = true
    const now = performance.now() * 0.001
    const deltaTime = wasRunning ? now - then : 0
    then = now
    if (isRunning) {
      time += deltaTime
    }
    wasRunning = isRunning

    if (!state.isEnded) {
      requestRender()
    }

    if (interaction.isAnimating && !interaction.isDragging) {
      interaction.velocity *= 0.95
      interaction.rotationY += interaction.velocity
    }

    if (interaction.isAnimating) {
      fly(animNodes, time, interaction)
    } else {
      move(
        animNodes,
        time,
        interaction,
        snowNode,
        cloudNode,
        rainNode,
        sunNode,
        state,
      )
    }

    renderer(
      device,
      context,
      canvas,
      renderPassDescriptor,
      pipeline,
      sunPipeline,
      root,
      meshes,
      settings,
      animNodes,
      time,
    )
  }
  render()

  // initGUI(root, render, settings)
}

main().catch(console.error)
