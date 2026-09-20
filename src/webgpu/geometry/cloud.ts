export function createCloudVertices(
  cloudCount: number,
  spreadX: number,
  spreadZ: number,
) {
  const positions: number[] = []
  const colors: number[] = []

  const latBands = 10
  const lonBands = 10

  const topColor = [160, 160, 170]
  const bottomColor = [60, 60, 75]

  for (let i = 0; i < cloudCount; i++) {
    const rootX = (Math.random() - 0.5) * spreadX
    const rootY = (Math.random() - 0.5) * 20
    const rootZ = (Math.random() - 0.5) * spreadZ

    const maxRadius = 15 + Math.random() * 15

    const cloudWidth = maxRadius * 1.8

    const segments = 3

    for (let s = 0; s < segments; s++) {
      const t = (s + 1) / (segments + 1)
      const curve = Math.sin(t * Math.PI)

      const radius = maxRadius * (0.7 + 0.3 * curve)

      const cx = rootX - cloudWidth / 2 + cloudWidth * (s / (segments - 1))
      const cy = rootY + radius
      const cz = rootZ + (Math.random() - 0.5) * (radius * 0.5)

      for (let lat = 0; lat < latBands; lat++) {
        const theta1 = (lat * Math.PI) / latBands
        const theta2 = ((lat + 1) * Math.PI) / latBands

        for (let lon = 0; lon < lonBands; lon++) {
          const phi1 = (lon * 2 * Math.PI) / lonBands
          const phi2 = ((lon + 1) * 2 * Math.PI) / lonBands

          const squashY = 0.7

          const p1 = [
            cx + radius * Math.sin(theta1) * Math.cos(phi1),
            cy + radius * Math.cos(theta1) * squashY,
            cz + radius * Math.sin(theta1) * Math.sin(phi1),
          ]
          const p2 = [
            cx + radius * Math.sin(theta1) * Math.cos(phi2),
            cy + radius * Math.cos(theta1) * squashY,
            cz + radius * Math.sin(theta1) * Math.sin(phi2),
          ]
          const p3 = [
            cx + radius * Math.sin(theta2) * Math.cos(phi2),
            cy + radius * Math.cos(theta2) * squashY,
            cz + radius * Math.sin(theta2) * Math.sin(phi2),
          ]
          const p4 = [
            cx + radius * Math.sin(theta2) * Math.cos(phi1),
            cy + radius * Math.cos(theta2) * squashY,
            cz + radius * Math.sin(theta2) * Math.sin(phi1),
          ]

          const getVertexColor = (vertexY: number) => {
            let ratio = (vertexY - rootY) / (maxRadius * 1.5)
            ratio = Math.max(0, Math.min(1, ratio))

            return [
              bottomColor[0] + (topColor[0] - bottomColor[0]) * ratio,
              bottomColor[1] + (topColor[1] - bottomColor[1]) * ratio,
              bottomColor[2] + (topColor[2] - bottomColor[2]) * ratio,
            ]
          }

          const c1 = getVertexColor(p1[1])
          const c2 = getVertexColor(p2[1])
          const c3 = getVertexColor(p3[1])
          const c4 = getVertexColor(p4[1])

          positions.push(...p1, ...p2, ...p4)
          colors.push(...c1, ...c2, ...c4)

          positions.push(...p2, ...p3, ...p4)
          colors.push(...c2, ...c3, ...c4)
        }
      }
    }
  }
  const numVertices = positions.length / 3

  const vertexData = new Float32Array(numVertices * 4)
  const colorData = new Uint8Array(vertexData.buffer)

  for (let i = 0; i < numVertices; ++i) {
    const position = positions.slice(i * 3, i * 3 + 3)
    vertexData.set(position, i * 4)

    const color = colors.slice(i * 3, i * 3 + 3)
    colorData.set(color, i * 16 + 12)
    colorData[i * 16 + 15] = 255
  }

  return {
    vertexData,
    numVertices,
  }
}
