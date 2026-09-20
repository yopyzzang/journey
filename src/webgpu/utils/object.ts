import { SceneGraphNode } from './scene-graph.js'
import { TRS, type TRSParams } from './TRS.js'
import { mat4 } from './matrix.js'

type NonIndexedVertices = {
  vertexBuffer: GPUBuffer
  numVertices: number
}
type IndexedVertices = {
  vertexBuffer: GPUBuffer
  indexBuffer: GPUBuffer
  numIndices: number
}
export type Vertices = NonIndexedVertices | IndexedVertices

type NonIndexedData = {
  vertexData: Float32Array<ArrayBuffer>
  numVertices: number
}
type IndexedData = {
  vertexData: Float32Array<ArrayBuffer>
  indexData: Uint16Array<ArrayBuffer>
  numIndices: number
}
type GeometryData = NonIndexedData | IndexedData

export type MeshType = 'default' | 'sun'

export type Mesh = {
  node: SceneGraphNode
  vertices: Vertices
  type: MeshType
  pipeline: GPURenderPipeline
  color?: Float32Array<ArrayBuffer> | number[]
}

export type Context = {
  pass: GPURenderPassEncoder
  viewProjection: Float32Array<ArrayBuffer>
  time?: number
}

type Object = {
  uniformBuffer: GPUBuffer
  uniformValues: Float32Array<ArrayBuffer>
  colorValue: Float32Array<ArrayBuffer>
  matrixValue: Float32Array<ArrayBuffer>
  bindGroup: GPUBindGroup
}

const meshes: Mesh[] = []
const animNodes: SceneGraphNode[] = []
const objectInfos: Object[] = []

let objectNdx = 0
let currentPipeline: GPURenderPipeline | null = null // 파이프라인 캐싱용 상태 변수

const kObjectColor = [1, 1, 1]
const kObjectSpacing = 10

export function addTRSSceneGraphNode(
  name: string,
  parent: SceneGraphNode,
  trs: TRSParams,
) {
  const node = new SceneGraphNode(name, new TRS(trs))
  if (parent) {
    node.setParent(parent)
  }
  return node
}

function addMesh(mesh: Mesh) {
  meshes.push(mesh)
  return mesh
}

function addObjectNode(
  name: string,
  parent: SceneGraphNode,
  trs: TRSParams,
  vertices: Vertices,
  type: MeshType,
  pipeline: GPURenderPipeline,
  color?: Float32Array<ArrayBuffer> | number[],
) {
  const node = addTRSSceneGraphNode(name, parent, trs)
  return addMesh({ node, vertices, type, pipeline, color })
}

function addRootObject(
  name: string,
  parent: SceneGraphNode,
  ndx: number,
  rootVertices: Vertices,
  pipeline: GPURenderPipeline,
  subVertices?: Vertices,
) {
  const objectName = `${name} ${ndx}`
  const object = addTRSSceneGraphNode(objectName, parent, {
    translation: [ndx * kObjectSpacing, 0, 0],
  })
  animNodes.push(object)

  const kObjectSize = [1, 1, 1]

  addObjectNode(
    `${objectName}-mesh`,
    object,
    { scale: kObjectSize },
    rootVertices,
    'default',
    pipeline,
    kObjectColor,
  )

  if (subVertices)
    addObjectNode(
      `${objectName}-sub-mesh`,
      object,
      { scale: kObjectSize },
      subVertices,
      'default',
      pipeline,
      kObjectColor,
    )
}

function createObjectInfo(device: GPUDevice, pipeline: GPURenderPipeline) {
  const uniformBufferSize = 80 // 16(mat4x4) + 4(vec4f) = 20개의 f32 = 80바이트 고정
  const uniformBuffer = device.createBuffer({
    label: 'Uniform Buffer',
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })
  const uniformValues = new Float32Array(uniformBufferSize / 4)

  const kMatrixOffset = 0
  const kColorOffset = 16

  const matrixValue = uniformValues.subarray(kMatrixOffset, kMatrixOffset + 16)
  const colorValue = uniformValues.subarray(kColorOffset, kColorOffset + 4)

  const bindGroup = device.createBindGroup({
    label: 'Bind group for object',
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: uniformBuffer }],
  })

  return {
    uniformBuffer,
    uniformValues,
    colorValue,
    matrixValue,
    bindGroup,
  }
}

function createVertices(
  name: string,
  device: GPUDevice,
  geometry: GeometryData,
): Vertices {
  const vertexBuffer = device.createBuffer({
    label: `${name}: vertex buffer`,
    size: geometry.vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })
  device.queue.writeBuffer(vertexBuffer, 0, geometry.vertexData)

  if ('indexData' in geometry) {
    const indexBuffer = device.createBuffer({
      label: `${name}: index buffer`,
      size: geometry.indexData.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(indexBuffer, 0, geometry.indexData)

    return { vertexBuffer, indexBuffer, numIndices: geometry.numIndices }
  }

  return { vertexBuffer, numVertices: geometry.numVertices }
}

function drawObject(
  device: GPUDevice,
  context: Context,
  mesh: Mesh,
  matrix: Float32Array<ArrayBuffer>,
) {
  const { pass, viewProjection, time = 0 } = context

  if (currentPipeline !== mesh.pipeline) {
    pass.setPipeline(mesh.pipeline)
    currentPipeline = mesh.pipeline
  }

  if (objectNdx === objectInfos.length) {
    objectInfos.push(createObjectInfo(device, mesh.pipeline))
  }
  const { matrixValue, colorValue, uniformBuffer, uniformValues, bindGroup } =
    objectInfos[objectNdx++]

  mat4.multiply(viewProjection, matrix, matrixValue)

  if (mesh.type === 'sun') {
    uniformValues[16] = time // uni.time
    uniformValues[17] = 3.0 // uni.intensity
  } else if (mesh.type === 'default' && mesh.color) {
    colorValue.set(mesh.color) // uni.color
  }

  device.queue.writeBuffer(uniformBuffer, 0, uniformValues)

  pass.setBindGroup(0, bindGroup)
  pass.setVertexBuffer(0, mesh.vertices.vertexBuffer)

  if ('indexBuffer' in mesh.vertices) {
    pass.setIndexBuffer(mesh.vertices.indexBuffer, 'uint16')
    pass.drawIndexed(mesh.vertices.numIndices)
  } else {
    pass.draw(mesh.vertices.numVertices)
  }
}

function drawMesh(device: GPUDevice, context: Context, mesh: Mesh) {
  drawObject(device, context, mesh, mesh.node.worldMatrix)
}

export function resetRenderState() {
  objectNdx = 0
  currentPipeline = null
}

export {
  createVertices,
  addObjectNode,
  addRootObject,
  drawMesh,
  meshes,
  animNodes,
}
