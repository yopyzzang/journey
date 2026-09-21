export function createRainVertices(
  particleCount: number,
  spreadX: number,
  spreadZ: number,
  height: number,
) {
  const positions: number[] = []
  const colors: number[] = []
  const size = 0.1

  const slotSize = spreadZ / particleCount
  const zSlots = Array.from({ length: particleCount }, (_, i) => i)
  for (let i = zSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[zSlots[i], zSlots[j]] = [zSlots[j], zSlots[i]]
  }

  for (let i = 0; i < particleCount; i++) {
    const cx = (Math.random() - 0.5) * spreadX
    const cy = Math.random() * height

    const slotCenter = (zSlots[i] + 0.5) * slotSize - spreadZ / 2
    const jitter = (Math.random() - 0.5) * slotSize * 0.4
    const cz = slotCenter + jitter

    const tl = [cx - size, cy + size * 10, cz]
    const bl = [cx - size, cy - size * 10, cz]
    const tr = [cx + size, cy + size * 10, cz]
    const br = [cx + size, cy - size * 10, cz]

    positions.push(...tl, ...bl, ...tr)
    colors.push(200, 220, 255, 200, 220, 255, 200, 220, 255)
    positions.push(...tr, ...bl, ...br)
    colors.push(200, 220, 255, 200, 220, 255, 200, 220, 255)
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
