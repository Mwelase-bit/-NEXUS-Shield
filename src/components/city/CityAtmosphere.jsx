import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function CitySparkles() {
  return (
    <>
      <Sparkles count={80} scale={[45, 8, 45]} size={2} speed={0.3} color="#00B4D8" opacity={0.3} />
      <Sparkles count={40} scale={[35, 10, 35]} size={2.5} speed={0.15} color="#7B2FFF" opacity={0.2} />
    </>
  );
}

export function CityContactShadows() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial transparent opacity={0.35} />
    </mesh>
  );
}

export function HazeLayers() {
  const ref1 = useRef();
  useFrame(({ clock }) => {
    if (ref1.current?.material) {
      ref1.current.material.opacity = 0.03 + Math.sin(clock.elapsedTime * 0.3) * 0.015;
    }
  });
  return (
    <mesh ref={ref1} position={[0, 8, 0]}>
      <planeGeometry args={[60, 20]} />
      <meshBasicMaterial color="#7B2FFF" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function HorizonGlow() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[18, 26, 64]} />
      <meshBasicMaterial color="#00B4D8" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}
