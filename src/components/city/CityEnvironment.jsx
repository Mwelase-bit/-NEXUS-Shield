import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ROAD_PATHS, DISTRICTS } from './cityConfig';

function Road({ from, to, index = 0 }) {
  const lineRef = useRef();
  const mid = [(from[0] + to[0]) / 2, 0.03, (from[1] + to[1]) / 2];
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      lineRef.current.material.opacity = 0.35 + Math.sin(clock.elapsedTime * 2 + index) * 0.2;
    }
  });

  return (
    <group position={mid} rotation={[0, angle, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, len + 0.5]} />
        <meshStandardMaterial color="#0a1628" metalness={0.4} roughness={0.7} emissive="#00B4D8" emissiveIntensity={0.05} />
      </mesh>
      <mesh ref={lineRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12, len]} />
        <meshBasicMaterial color="#00FFE5" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position, color = '#00B4D8' }) {
  const light = useRef();
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
        <meshStandardMaterial color="#1B3A5C" metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <pointLight ref={light} position={[0, 2.5, 0]} color={color} intensity={0.8} distance={8} />
    </group>
  );
}

function CyberTree({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 6]} />
        <meshStandardMaterial color="#1B3A5C" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.5, 1.2, 6]} />
        <meshStandardMaterial color="#00B4D8" emissive="#00B4D8" emissiveIntensity={0.3} transparent opacity={0.85} wireframe />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#7B2FFF" emissive="#7B2FFF" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function DataPillar({ position, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#050A14" emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <ringGeometry args={[0.5, 0.7, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function CityEnvironment() {
  const ringRef = useRef();
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 0.15;
  });

  const lamps = useMemo(
    () => [
      [-6, 0, -6],
      [6, 0, -6],
      [-6, 0, 6],
      [6, 0, 6],
      [0, 0, -10],
      [0, 0, 10],
    ],
    []
  );

  const trees = useMemo(
    () => [
      [-18, 0, -5],
      [18, 0, -3],
      [-16, 0, 10],
      [18, 0, 14],
      [-5, 0, -14],
      [8, 0, 15],
    ],
    []
  );

  return (
    <group>
      {/* Central plaza */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[3, 5.5, 64]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#0D1B2A" emissive="#00B4D8" emissiveIntensity={0.15} metalness={0.5} />
      </mesh>

      {ROAD_PATHS.map(([from, to], i) => (
        <Road key={i} from={from} to={to} index={i} />
      ))}

      {lamps.map((p, i) => (
        <StreetLamp key={i} position={p} color={i % 2 ? '#7B2FFF' : '#00B4D8'} />
      ))}
      {trees.map((p, i) => (
        <CyberTree key={i} position={p} />
      ))}

      <DataPillar position={[-4, 0, -3]} color="#00FFE5" />
      <DataPillar position={[4, 0, 3]} color="#7B2FFF" />

      {/* District zone rings on ground */}
      {Object.values(DISTRICTS).map((d) => (
        <mesh
          key={d.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[d.position[0], 0.02, d.position[2]]}
        >
          <ringGeometry args={[2.5, 3, 32]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
