struct Uniforms {
  matrix4: mat4x4f,
  time: f32,
  intensity: f32,
}

struct VertexInput {
  @location(0) position: vec4f,
  @location(1) color: vec4f,
}

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var<uniform> uni: Uniforms;

@vertex
fn vs(vert: VertexInput) -> VSOutput {
  var vsOut: VSOutput;
  vsOut.position = uni.matrix4 * vert.position;

  vsOut.uv = vert.position.xy / 48.0;

  return vsOut;
}

@fragment
fn fs(vsOut: VSOutput) -> @location(0) vec4f {
  let dist = length(vsOut.uv);
  let core = smoothstep(0.15, 0.0, dist) * 2.5;
  let corona = exp(-dist * 6.0) * 1.5;

  let totalLight = core + corona;
  let flicker = sin(uni.time * 3.0) * 0.05 + 0.95;

  let sunColor = vec3f(1.0, 0.85, 0.6);

  let finalColor = sunColor * totalLight * uni.intensity * flicker;

  return vec4f(finalColor, totalLight * uni.intensity);
}
