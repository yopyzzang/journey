export function createSnowVertices(
  particleCount: number,
  spread: number,
  height: number,
) {
  const positions: number[] = []
  const colors: number[] = []

  const size = 0.025

  for (let i = 0; i < particleCount; i++) {
    const cx = (Math.random() - 0.5) * spread
    const cy = Math.random() * height
    const cz = (Math.random() - 0.5) * spread

    const tl = [cx - size, cy + size, cz] // 좌상단
    const bl = [cx - size, cy - size, cz] // 좌하단
    const tr = [cx + size, cy + size, cz] // 우상단
    const br = [cx + size, cy - size, cz] // 우하단

    positions.push(...tl, ...bl, ...tr)
    colors.push(255, 255, 255, 255, 255, 255, 255, 255, 255)

    positions.push(...tr, ...bl, ...br)
    colors.push(255, 255, 255, 255, 255, 255, 255, 255, 255)
  }

  const numVertices = positions.length / 3

  const vertexData = new Float32Array(numVertices * 4)
  const colorData = new Uint8Array(vertexData.buffer)

  for (let i = 0; i < numVertices; ++i) {
    const position = positions.slice(i * 3, i * 3 + 3)
    vertexData.set(position, i * 4)

    const color = colors.slice(i * 3, i * 3 + 3)
    colorData.set(color, i * 16 + 12)
    colorData[i * 16 + 15] = 255 // Alpha
  }

  return {
    vertexData,
    numVertices,
  }
}
