export function createSunVertices(radius: number, segments: number) {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments
      const x = Math.cos(phi) * sinTheta * radius
      const y = cosTheta * radius
      const z = Math.sin(phi) * sinTheta * radius

      positions.push(x, y, z)

      const r = 1.0
      const g = (lat / segments) * 0.3 + 0.7
      const b = (lat / segments) * 0.1

      colors.push(r * 255, g * 255, b * 255)
    }
  }

  // 인덱스
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const a = lat * (segments + 1) + lon
      const b = a + segments + 1
      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }

  const numVertices = positions.length / 3
  const vertexData = new Float32Array(numVertices * 4) // xyz + color
  const colorData = new Uint8Array(vertexData.buffer)
  const indexData = new Uint16Array(indices)

  for (let i = 0; i < numVertices; ++i) {
    const position = positions.slice(i * 3, i * 3 + 3)
    vertexData.set(position, i * 4)

    const color = colors.slice(i * 3, i * 3 + 3)
    colorData.set(color, i * 16 + 12)
    colorData[i * 16 + 15] = 255
  }

  return { vertexData, indexData, numIndices: indexData.length }
}
