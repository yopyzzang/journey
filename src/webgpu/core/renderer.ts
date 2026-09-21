import { degToRad } from '../utils/math.js'
import { mat4 } from '../utils/matrix.js'
import type { SceneGraphNode } from '../utils/scene-graph.js'
import { drawMesh, type Mesh, resetRenderState } from '../utils/object.js'
import type { Setting } from '../../pages/carrot/client.js'
import type { TRS } from '../utils/TRS.js'
import { lerp } from '../animations/common.js'

let depthTexture: GPUTexture
let cameraOffsetZ = 0
// let cameraOffsetY = 0

const CHASE_DISTANCE_Z = 10
// const CHASE_DISTANCE_Y = 10
const FOLLOW_THRESHOLD_Z = -100

export function renderer(
  device: GPUDevice,
  context: GPUCanvasContext,
  canvas: HTMLCanvasElement,
  renderPassDescriptor: GPURenderPassDescriptor,
  pipeline: GPURenderPipeline,
  sunPipeline: GPURenderPipeline,
  root: SceneGraphNode,
  meshes: Mesh[],
  settings: Setting,
  animNodes: SceneGraphNode[],
  time: number,
) {
  resetRenderState()
  const canvasTexture = context.getCurrentTexture()
  const aspect = canvas.clientWidth / canvas.clientHeight

  if (renderPassDescriptor.colorAttachments[0])
    renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView()

  if (
    !depthTexture ||
    depthTexture.width !== canvasTexture.width ||
    depthTexture.height !== canvasTexture.height
  ) {
    if (depthTexture) depthTexture.destroy()
    depthTexture = device.createTexture({
      size: [canvasTexture.width, canvasTexture.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })
  }

  if (renderPassDescriptor.depthStencilAttachment)
    renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView()

  const encoder = device.createCommandEncoder()
  const pass = encoder.beginRenderPass(renderPassDescriptor)
  pass.setPipeline(pipeline)
  pass.setPipeline(sunPipeline)

  const targetSource = animNodes[0].children[0].source as TRS

  // 물체가 임계값 이상 이동하면 카메라도 따라감
  if (targetSource.translation[2] < FOLLOW_THRESHOLD_Z) {
    cameraOffsetZ = lerp(
      cameraOffsetZ,
      targetSource.translation[2] + CHASE_DISTANCE_Z,
      0.005,
    )
  }

  // if (targetSource.translation[1] > FOLLOW_THRESHOLD_Y) {
  //   cameraOffsetY = lerp(cameraOffsetY, targetSource.translation[1] * 0.5, 0.05)
  // }

  const projection = mat4.perspective(degToRad(45), aspect, 1, 3000)
  const camera = mat4.identity()

  mat4.translate(camera, [0, 2, cameraOffsetZ], camera)
  // mat4.rotateY(camera, settings.cameraRotation, camera)
  mat4.rotateX(camera, settings.cameraRotation, camera)
  mat4.translate(
    camera,
    [
      settings.cameraTranslationX,
      settings.cameraTranslationY,
      settings.cameraTranslationZ,
    ],
    camera,
  )

  const view = mat4.inverse(camera)
  const viewProjection = mat4.multiply(projection, view)

  const ctx = { pass, viewProjection, time }
  root.updateWorldMatrix()

  for (const mesh of meshes) {
    if (mesh.node.name === 'snow-mesh' && targetSource.translation[2] <= -450)
      continue
    if (mesh.node.name === 'rain-mesh' && targetSource.translation[2] >= -450)
      continue
    if (mesh.node.name === 'cloud-mesh' && targetSource.translation[2] >= -450)
      continue
    if (mesh.node.name === 'sun-mesh' && targetSource.translation[2] >= -680)
      continue
    drawMesh(device, ctx, mesh)
  }

  pass.end()
  const commandBuffer = encoder.finish()
  device.queue.submit([commandBuffer])
}
