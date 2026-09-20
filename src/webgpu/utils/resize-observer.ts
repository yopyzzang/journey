export function resizeObserver(
  canvasElement: HTMLCanvasElement,
  device: GPUDevice,
  dpr: number,
) {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const canvas = entry.target as HTMLCanvasElement
      const width = entry.contentBoxSize[0].inlineSize * dpr
      const height = entry.contentBoxSize[0].blockSize * dpr
      canvas.width = Math.max(
        1,
        Math.min(width, device.limits.maxTextureDimension2D),
      )
      canvas.height = Math.max(
        1,
        Math.min(height, device.limits.maxTextureDimension2D),
      )
    }
  })
  observer.observe(canvasElement)
}
