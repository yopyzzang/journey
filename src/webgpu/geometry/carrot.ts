const CARROT_OPTIONS = {
  radius: 1,
  height: 4,
  subdivisions: 24,
  verticalSegments: 24,
}
const { radius, height, subdivisions, verticalSegments } = CARROT_OPTIONS

const CARROT_LEAF_OPTIONS = {
  numLeaves: 4,
  leafSize: 0.05,
  leafSegments: 24,
  topHeight: height - 0.2,
}
const { numLeaves, leafSize, leafSegments, topHeight } = CARROT_LEAF_OPTIONS

// prettier-ignore
function createCarrotVertices() {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = [];

  function addVertex(x: number, y: number, z: number, color: number[]) {
    positions.push(x, y, z);
    colors.push(...color);
  }
  function getOrganicRadius(v: number, angle: number) {
    let r = Math.pow(v, 0.6) * radius;

    const unevenness = Math.sin(angle * 3) * 0.06 + Math.cos(angle * 5) * 0.04;
    r += unevenness * radius * v;
    r += Math.sin(v * Math.PI * 15) * (0.02 * radius);

    return Math.max(0, r);
  }

  function getColor(v: number, u: number) {
    let baseR = 255 - ((1 - v) * 15);
    let baseG = 115 - ((1 - v) * 30);
    let baseB = 0;

    const wave = Math.sin(u * Math.PI);
    baseR += wave * 10;
    baseG += wave * 15;

    const ridges = Math.sin(v * Math.PI * 25);
    if (ridges < 0) {
      const shadow = -ridges * 3;
      baseR -= shadow;
      baseG -= shadow * 1.2;
    }

    baseR = Math.min(255, Math.max(0, baseR));
    baseG = Math.min(255, Math.max(0, baseG));
    baseB = Math.min(255, Math.max(0, baseB));

    return [baseR, baseG, baseB];
  }

  // body
  for (let y = 0; y <= verticalSegments; ++y) {
    const v = y / verticalSegments;
    const h = v * height;

    for (let i = 0; i < subdivisions; ++i) {
      const u = i / subdivisions;
      const angle = u * Math.PI * 2;
      const r = getOrganicRadius(v, angle);
      const color = getColor(v, u);

      addVertex(Math.cos(angle) * r, h, Math.sin(angle) * r, color);
    }
  }

  // top cap
  const topColorCenter = [255, 105, 0];
  const centerIndex = positions.length / 3;
  addVertex(0, height - 0.2, 0, topColorCenter);

  // body indices
  for (let y = 0; y < verticalSegments; ++y) {
    for (let i = 0; i < subdivisions; ++i) {
      const next_i = (i + 1) % subdivisions;

      const v00 = y * subdivisions + i;
      const v01 = y * subdivisions + next_i;
      const v10 = (y + 1) * subdivisions + i;
      const v11 = (y + 1) * subdivisions + next_i;

      indices.push(v00, v01, v10);
      indices.push(v01, v11, v10);
    }
  }

  // top cap indices
  const topRowStart = verticalSegments * subdivisions; // 가장 윗줄 정점 시작 번호
  for (let i = 0; i < subdivisions; ++i) {
    const next_i = (i + 1) % subdivisions;
    const v0 = topRowStart + i;
    const v1 = topRowStart + next_i;

    indices.push(v0, v1, centerIndex);
  }

  const numVertices = positions.length / 3;
  const vertexData = new Float32Array(numVertices * 4); // xyz + color
  const colorData = new Uint8Array(vertexData.buffer);
  const indexData = new Uint16Array(indices);
  for (let i = 0; i < numVertices; ++i) {
    const position = positions.slice(i * 3, i * 3 + 3);
    vertexData.set(position, i * 4);

    const color = colors.slice(i * 3, i * 3 + 3);
    colorData.set(color, i * 16 + 12);
    colorData[i * 16 + 15] = 255;
  }

  return {
    vertexData,
    indexData,
    numIndices: indexData.length
  };
}

function createCarrotLeafVertices() {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  function addVertexXYZ(x: number, y: number, z: number, color: number[]) {
    positions.push(x, y, z)
    colors.push(...color)
  }

  for (let j = 0; j < numLeaves; j++) {
    const baseAngle = (j / numLeaves) * Math.PI * 2 // 각 잎사귀가 뻗어갈 방향
    const tilt = Math.PI / 5 // 이파리가 바깥으로 벌어지는 각도

    const getLeafPoint3D = (t: number) => {
      const x2d = leafSize * 16 * Math.pow(Math.sin(t), 3)
      const y2d =
        leafSize *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t) +
          17)

      const curl = Math.pow(y2d, 1.8) * 0.15

      const r_out = y2d * Math.sin(tilt) + curl
      const h_out = topHeight + y2d * Math.cos(tilt) - curl * 0.8

      const x3d = r_out * Math.cos(baseAngle) + x2d * Math.sin(baseAngle)
      const z3d = r_out * Math.sin(baseAngle) - x2d * Math.cos(baseAngle)

      return { x: x3d, y: h_out, z: z3d, y2d }
    }

    // 중심점
    const centerY2d = 15 * leafSize
    const centerR = centerY2d * Math.sin(tilt)
    const centerH = topHeight + centerY2d * Math.cos(tilt)
    const center3d = {
      x: centerR * Math.cos(baseAngle),
      y: centerH,
      z: centerR * Math.sin(baseAngle),
    }

    const getLeafColor = (y2d: number) => {
      const ratio = Math.min(1.0, y2d / 1.3) // 최대 길이 대략 1.3

      return [
        7 + ratio * (110 - 40),
        84 + ratio * (200 - 100),
        69 + ratio * (50 - 20),
      ]
    }
    const centerColor = getLeafColor(centerY2d)
    const baseIndex = positions.length / 3
    addVertexXYZ(center3d.x, center3d.y, center3d.z, centerColor)

    // 윤곽선 정점
    for (let i = 0; i < leafSegments; i++) {
      const t = (i / leafSegments) * Math.PI * 2
      const p = getLeafPoint3D(t)
      const c = getLeafColor(p.y2d)
      addVertexXYZ(p.x, p.y, p.z, c)
    }

    // 인덱스
    const centerIdx = baseIndex
    for (let i = 0; i < leafSegments; i++) {
      const p0_idx = baseIndex + 1 + i
      const p1_idx = baseIndex + 1 + ((i + 1) % leafSegments)

      // 앞면 (시계 방향)
      indices.push(centerIdx, p1_idx, p0_idx)
      // 뒷면 (반시계 방향)
      indices.push(centerIdx, p0_idx, p1_idx)
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

  return {
    vertexData,
    indexData,
    numIndices: indexData.length,
  }
}

export { createCarrotVertices, createCarrotLeafVertices }
