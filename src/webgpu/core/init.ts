export async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error('WebGPU를 지원하지 않는 브라우저입니다.')
  }
  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    throw new Error('적합한 GPU 어댑터를 찾을 수 없습니다.')
  }

  const device = await adapter.requestDevice()
  const dpr = window.devicePixelRatio || 1
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const context = canvas.getContext('webgpu') as GPUCanvasContext
  const format = navigator.gpu.getPreferredCanvasFormat()

  if (!context) {
    throw new Error('GPUCanvasContext를 찾을 수 없습니다.')
  }
  context.configure({ device, format })

  return { canvas, context, device, dpr, format }
}
