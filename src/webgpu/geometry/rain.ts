export function createRainVertices(
  particleCount: number,
  spreadX: number,
  spreadZ: number,
  height: number,
) {
  const positions: number[] = []
  const colors: number[] = []
  const size = 0.1

  // 🌟 z를 particleCount만큼 균등 슬롯으로 나눠서 최소 간격 보장
  const slotSize = spreadZ / particleCount
  const zSlots = Array.from({ length: particleCount }, (_, i) => i)
  // 슬롯 순서를 섞어서 x/y와의 상관관계(패턴처럼 보이는 것) 방지
  for (let i = zSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[zSlots[i], zSlots[j]] = [zSlots[j], zSlots[i]]
  }

  for (let i = 0; i < particleCount; i++) {
    const cx = (Math.random() - 0.5) * spreadX
    const cy = Math.random() * height

    // 슬롯 중심 + 슬롯 폭의 40% 이내에서만 지터 → 최소 간격(슬롯 폭의 60%) 항상 보장
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
