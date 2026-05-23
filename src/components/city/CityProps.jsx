import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

function SurveillanceDrone({ center, radius = 5, height = 6, color = '#00B4D8', speed = 0.4 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed;
    ref.current.position.set(
      center[0] + Math.cos(t) * radius,
      height + Math.sin(t * 2) * 0.3,
      center[2] + Math.sin(t) * radius
    );
    ref.current.rotation.y = -t + Math.PI / 2;
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={1.5} metalness={0.9} />
      </mesh>
      <pointLight color={color} intensity={0.5} distance={6} />
    </group>
  );
}

/** HTML billboard — avoids drei Text font loading failures */
export function HoloBillboard({ position, label, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });
  return (
    <group ref={ref} position={position}>
      <Billboard follow lockX lockZ>
        <Html center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div className="holo-billboard" style={{ borderColor: color, color }}>
            {label.toUpperCase()}
          </div>
        </Html>
      </Billboard>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.2, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function PerimeterPylon({ position, color }) {
  const bulb = useRef();
  useFrame(({ clock }) => {
    if (bulb.current?.material) {
      bulb.current.material.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.4;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#1B3A5C" metalness={0.7} />
      </mesh>
      <mesh ref={bulb} position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export default function CityProps() {
  const pylons = useMemo(
    () => [
      [-22, 0, -22],
      [22, 0, -22],
      [-22, 0, 22],
      [22, 0, 22],
    ],
    []
  );

  const billboards = useMemo(
    () =>
      Object.values(DISTRICTS).map((d) => ({
        position: [d.position[0], d.id === 'CORE' ? 9 : 5.5, d.position[2] + (d.position[2] > 0 ? 2.5 : -2.5)],
        label: d.name.replace('THE ', ''),
        color: d.color,
      })),
    []
  );

  return (
    <group>
      {pylons.map((p, i) => (
        <PerimeterPylon key={i} position={p} color={i % 2 ? '#7B2FFF' : '#00B4D8'} />
      ))}
      <SurveillanceDrone center={DISTRICTS.CORE.position} radius={7} color="#00FFE5" />
      <SurveillanceDrone center={DISTRICTS.VAULT.position} radius={4} color="#FFB800" speed={0.55} />
      {billboards.map((b, i) => (
        <HoloBillboard key={i} position={b.position} label={b.label} color={b.color} />
      ))}
    </group>
  );
}
