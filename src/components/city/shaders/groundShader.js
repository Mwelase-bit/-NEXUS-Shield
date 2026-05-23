import * as THREE from 'three';

export const groundVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const groundFragmentShader = `
  uniform float uTime;
  uniform vec3 uGridColor;
  uniform vec3 uBaseColor;
  uniform vec3 uPulseColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  float grid(vec2 st, float res) {
    vec2 grid = fract(st * res);
    vec2 line = step(0.92, grid) + step(grid, 0.04);
    return min(line.x + line.y, 1.0);
  }

  void main() {
    vec2 world = vWorldPos.xz * 0.35;
    float g = grid(world, 1.0);
    float g2 = grid(world, 4.0) * 0.5;
    float scan = sin(vWorldPos.x * 0.5 + vWorldPos.z * 0.5 - uTime * 1.5) * 0.5 + 0.5;
    float pulse = sin(uTime * 0.8) * 0.15 + 0.85;
    float dist = length(vWorldPos.xz);
    float plaza = smoothstep(6.0, 0.0, dist);

    vec3 col = uBaseColor;
    col += uGridColor * g * 0.35;
    col += uGridColor * g2 * 0.15;
    col += uPulseColor * scan * g * 0.12 * pulse;
    col += uPulseColor * plaza * 0.08;

    float fade = smoothstep(28.0, 22.0, dist);
    gl_FragColor = vec4(col, max(fade, 0.85));
  }
`;

export function createGroundMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color('#050A14') },
      uGridColor: { value: new THREE.Color('#1B3A5C') },
      uPulseColor: { value: new THREE.Color('#00B4D8') },
    },
    vertexShader: groundVertexShader,
    fragmentShader: groundFragmentShader,
    transparent: true,
  });
}
