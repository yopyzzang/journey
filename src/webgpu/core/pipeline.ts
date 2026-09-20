import basicShader from '../shaders/basic.wgsl?raw'
import sunShader from '../shaders/sun.wgsl?raw'

export async function createPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
) {
  const basicModule = device.createShaderModule({
    label: 'Shader module',
    code: basicShader,
  })
  const sunModule = device.createShaderModule({
    label: 'Sun Shader module',
    code: sunShader,
  })

  const pipeline = device.createRenderPipeline({
    label: 'Render pipeline',
    layout: 'auto',
    vertex: {
      module: basicModule,
      buffers: [
        {
          arrayStride: 4 * 4,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x3',
            },
            { shaderLocation: 1, offset: 12, format: 'unorm8x4' },
          ],
        },
      ],
    },
    fragment: { module: basicModule, targets: [{ format }] },
    primitive: { cullMode: 'back' },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  })

  const sunPipeline = device.createRenderPipeline({
    label: 'sun render pipeline',
    layout: 'auto',
    vertex: {
      module: sunModule,
      buffers: [
        {
          arrayStride: 4 * 4,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x3',
            },
            { shaderLocation: 1, offset: 12, format: 'unorm8x4' },
          ],
        },
      ],
    },
    fragment: {
      module: sunModule,
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one',
              operation: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one',
              operation: 'add',
            },
          },
        },
      ],
    },
    primitive: { cullMode: 'back' },

    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  })

  const renderPassDescriptor: GPURenderPassDescriptor = {
    label: 'Canvas render pass descriptor',
    colorAttachments: [
      {
        view: undefined as unknown as GPUTextureView,
        clearValue: { r: 26 / 255, g: 28 / 255, b: 32 / 255, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: undefined as unknown as GPUTextureView,
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  }

  return { pipeline, sunPipeline, renderPassDescriptor }
}
