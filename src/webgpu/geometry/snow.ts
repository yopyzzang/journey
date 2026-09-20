export function createSnowVertices(
  particleCount: number,
  spread: number,
  height: number,
) {
  const positions: number[] = []
  const colors: number[] = []

  // 아주 작은 정사각형 크기 (화면에서 도트처럼 보임)
  const size = 0.025

  for (let i = 0; i < particleCount; i++) {
    const cx = (Math.random() - 0.5) * spread
    const cy = Math.random() * height
    const cz = (Math.random() - 0.5) * spread

    // 네모를 만들기 위한 4개의 꼭짓점 준비
    const tl = [cx - size, cy + size, cz] // 좌상단
    const bl = [cx - size, cy - size, cz] // 좌하단
    const tr = [cx + size, cy + size, cz] // 우상단
    const br = [cx + size, cy - size, cz] // 우하단

    // 🌟 인덱스 없이 삼각형 2개를 그리기 위해 점 6개를 순서대로 넣습니다!

    // 1. 첫 번째 삼각형 (좌상 -> 좌하 -> 우상, 반시계)
    positions.push(...tl, ...bl, ...tr)
    colors.push(255, 255, 255, 255, 255, 255, 255, 255, 255) // 점 3개 분량 색상

    // 2. 두 번째 삼각형 (우상 -> 좌하 -> 우하, 반시계)
    positions.push(...tr, ...bl, ...br)
    colors.push(255, 255, 255, 255, 255, 255, 255, 255, 255) // 점 3개 분량 색상
  }

  // 눈송이 1개당 6개의 점이 들어갔으므로 (총 점 개수 = particleCount * 6)
  const numVertices = positions.length / 3

  // 🌟 기존과 완벽하게 동일한 16바이트(Float 4개) 인터리브드 버퍼 포맷
  const vertexData = new Float32Array(numVertices * 4)
  const colorData = new Uint8Array(vertexData.buffer)

  for (let i = 0; i < numVertices; ++i) {
    // 1. Position 세팅
    const position = positions.slice(i * 3, i * 3 + 3)
    vertexData.set(position, i * 4)

    // 2. Color 세팅
    const color = colors.slice(i * 3, i * 3 + 3)
    colorData.set(color, i * 16 + 12)
    colorData[i * 16 + 15] = 255 // Alpha
  }

  // 인덱스 없이 순수 vertex 배열만 리턴합니다!
  return {
    vertexData,
    numVertices,
  }
}
