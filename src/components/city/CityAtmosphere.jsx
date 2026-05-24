import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

/** Sky background plane — deep blue-purple gradient */
export function CityAtmosphere() {
  return (
    <>
      {/* Stars in the far distance */}
      <Stars radius={120} depth={60} count={1800} factor={2.5} saturation={0.1} fade speed={0.2} />

      {/* Atmospheric haze layer */}
      <mesh position={[0, 12, 0]}>
        <planeGeometry args={[120, 40]} />
        <meshBasicMaterial color="#1A0A3A" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </>
  );
}

/** Ambient floating data sparkles over the whole city */
export function CitySparkles() {
  return (
    <>
      <Sparkles count={60} scale={[50, 10, 50]} size={1.5} speed={0.25} color="#00B4D8" opacity={0.2} />
      <Sparkles count={30} scale={[40, 14, 40]} size={2.0} speed={0.12} color="#7B2FFF" opacity={0.15} />
    </>
  );
}

/** Horizon glow ring around the city perimeter */
export function HorizonGlow() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.04;
  });
  return (
    <mesh ref={ref} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[20, 30, 64]} />
      <meshBasicMaterial color="#00B4D8" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/** Animated data streams between districts (ground level) */
export function DataStreamParticles() {
  const ref = useRef();
  const progress = useRef([]);

  const streams = [
    { from: [0, 0.15, 0], to: [-12, 0.15, -8], color: '#00B4D8' },
    { from: [0, 0.15, 0], to: [12, 0.15, -8], color: '#FFB800' },
    { from: [0, 0.15, 0], to: [-10, 0.15, 10], color: '#7B2FFF' },
    { from: [0, 0.15, 0], to: [12, 0.15, 10], color: '#00FF94' },
    { from: [0, 0.15, 0], to: [-10, 0.15, 2], color: '#FF6B35' },
  ];

  if (progress.current.length === 0) {
    streams.forEach(() => progress.current.push(Math.random()));
  }

  useFrame((_, delta) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array;

    streams.forEach((s, i) => {
      progress.current[i] = (progress.current[i] + delta * 0.4) % 1.0;
      const t = progress.current[i];
      positions[i * 3 + 0] = s.from[0] + (s.to[0] - s.from[0]) * t;
      positions[i * 3 + 1] = s.from[1] + Math.sin(t * Math.PI) * 0.3;
      positions[i * 3 + 2] = s.from[2] + (s.to[2] - s.from[2]) * t;
    });

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const initPositions = new Float32Array(streams.length * 3);
  streams.forEach((s, i) => {
    initPositions[i * 3] = s.from[0];
    initPositions[i * 3 + 1] = s.from[1];
    initPositions[i * 3 + 2] = s.from[2];
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={streams.length} array={initPositions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#00FFE5" transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Street lamps */
export function StreetLamps() {
  const lampPositions = [
    [-6, 0, -6], [6, 0, -6], [-6, 0, 6], [6, 0, 6],
    [0, 0, -9], [0, 0, 9], [-4, 0, -4], [4, 0, 4],
  ];
  const colors = ['#00B4D8', '#7B2FFF', '#00FF94', '#00B4D8', '#FFB800', '#00B4D8', '#7B2FFF', '#00FF94'];

  return (
    <group>
      {lampPositions.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.07, 3.0, 6]} />
            <meshStandardMaterial color="#1A2A3A" metalness={0.9} />
          </mesh>
          <mesh position={[0.15, 2.9, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <cylinderGeometry args={[0.03, 0.04, 0.55, 6]} />
            <meshStandardMaterial color="#1A2A3A" metalness={0.9} />
          </mesh>
          <mesh position={[0.28, 3.0, 0]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={3} />
          </mesh>
          <pointLight position={[0.28, 3.0, 0]} color={colors[i]} intensity={0.8} distance={9} castShadow={false} />
        </group>
      ))}
    </group>
  );
}

/** Isometric "cyber trees" — stylised low-poly trees */
export function CyberTrees() {
  const positions = [
    [-16, 0, -5], [16, 0, -3], [-15, 0, 9], [16, 0, 12],
    [-4, 0, -13], [7, 0, 14], [-3, 0, 6], [4, 0, -6],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.13, 1.1, 6]} />
            <meshStandardMaterial color="#112233" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <dodecahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#0D3A20' : i % 3 === 1 ? '#0A2A3A' : '#1A0A30'}
              emissive={i % 3 === 0 ? '#00FF94' : i % 3 === 1 ? '#00B4D8' : '#7B2FFF'}
              emissiveIntensity={0.3}
              transparent opacity={0.92}
            />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <octahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#00FFE5' : '#B388FF'} emissive={i % 2 === 0 ? '#00FFE5' : '#B388FF'} emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
