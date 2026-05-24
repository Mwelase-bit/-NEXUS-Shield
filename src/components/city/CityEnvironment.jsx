import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

// Define explicit road segments to make traffic navigation super precise
const ROAD_SEGMENTS = [
  { from: [-14, -10], to: [0, 0] },
  { from: [0, 0], to: [14, -8] },
  { from: [0, 0], to: [-10, 12] },
  { from: [-10, 12], to: [14, 12] },
  { from: [-12, 4], to: [0, 0] },
  { from: [0, 0], to: [14, 12] },
  { from: [-14, -10], to: [-12, 4] },
  { from: [14, -8], to: [14, 12] },
];

function CyberTrafficCar({ segment, speed = 0.15, delay = 0, color = '#00FFE5' }) {
  const ref = useRef();
  
  const fromX = segment.from[0];
  const fromZ = segment.from[1];
  const toX = segment.to[0];
  const toZ = segment.to[1];
  
  const dx = toX - fromX;
  const dz = toZ - fromZ;
  const rotationY = Math.atan2(dx, dz);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + delay;
    const progress = (t * speed) % 1.0;
    
    // Smoothly calculate position along segment
    ref.current.position.x = fromX + progress * dx;
    ref.current.position.z = fromZ + progress * dz;
    ref.current.position.y = 0.08 + Math.abs(Math.sin(progress * Math.PI * 4)) * 0.04; // floating car bounce
  });

  return (
    <group ref={ref} rotation={[0, rotationY, 0]}>
      {/* Cyber car chassis */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.1, 0.55]} />
        <meshStandardMaterial color="#0A121C" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Neon glowing thruster/underglow */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.45]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Tail light trail */}
      <mesh position={[0, 0.03, -0.26]}>
        <boxGeometry args={[0.18, 0.04, 0.06]} />
        <meshBasicMaterial color="#FF2D55" />
      </mesh>
    </group>
  );
}

// Render dynamic cars running along segments
function TrafficSystem() {
  const cars = useMemo(() => {
    const list = [];
    const colors = ['#00FFE5', '#7B2FFF', '#00FF94', '#FFB800'];
    
    ROAD_SEGMENTS.forEach((seg, idx) => {
      // 2 cars per segment with staggered delays and speeds
      list.push({
        segment: seg,
        speed: 0.12 + (idx % 3) * 0.04,
        delay: idx * 1.5,
        color: colors[idx % colors.length],
      });
      list.push({
        segment: { from: seg.to, to: seg.from }, // Opposite traffic
        speed: 0.14 + (idx % 2) * 0.03,
        delay: idx * 2.2 + 0.8,
        color: colors[(idx + 2) % colors.length],
      });
    });
    return list;
  }, []);

  return (
    <group>
      {cars.map((c, i) => (
        <CyberTrafficCar
          key={i}
          segment={c.segment}
          speed={c.speed}
          delay={c.delay}
          color={c.color}
        />
      ))}
    </group>
  );
}

function Road({ from, to, index = 0 }) {
  const lineRef = useRef();
  
  const midX = (from[0] + to[0]) / 2;
  const midZ = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      // Flowing data speedway pulsation
      lineRef.current.material.opacity = 0.4 + Math.sin(clock.elapsedTime * 3.5 + index) * 0.2;
    }
  });

  return (
    <group position={[midX, 0.02, midZ]} rotation={[0, angle, 0]}>
      {/* Heavy Cyber Roadway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, len + 0.4]} />
        <meshStandardMaterial color="#060F1E" metalness={0.9} roughness={0.5} />
      </mesh>
      {/* Dual Neon curbs */}
      {[-0.88, 0.88].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, len]} />
          <meshBasicMaterial color="#1B3A5C" transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Central Flowing Laser Lane */}
      <mesh ref={lineRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.08, len]} />
        <meshBasicMaterial color="#00FFE5" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position, color = '#00B4D8' }) {
  const light = useRef();
  
  useFrame(({ clock }) => {
    if (light.current) {
      // Gentle electrical current flickering
      light.current.intensity = 1.0 + Math.sin(clock.elapsedTime * 8) * 0.08;
    }
  });

  return (
    <group position={position}>
      {/* Futuristic Curved Lamppost */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.08, 2.8, 6]} />
        <meshStandardMaterial color="#0A1826" metalness={0.9} />
      </mesh>
      <mesh position={[0.2, 2.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
        <meshStandardMaterial color="#0A1826" metalness={0.9} />
      </mesh>
      {/* Glowing Lantern */}
      <mesh position={[0.35, 2.8, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      <pointLight ref={light} position={[0.35, 2.7, 0]} color={color} intensity={1.2} distance={10} castShadow />
    </group>
  );
}

function CyberTree({ position }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Glowing Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 1.0, 6]} />
        <meshStandardMaterial color="#112233" emissive="#00B4D8" emissiveIntensity={0.2} />
      </mesh>
      {/* Holographic Wireframe Canopy */}
      <mesh position={[0, 1.4, 0]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#00FF94" emissive="#00FF94" emissiveIntensity={0.5} transparent opacity={0.8} wireframe />
      </mesh>
      {/* Floating Center Core Seed */}
      <mesh position={[0, 1.4, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#7B2FFF" emissive="#7B2FFF" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function DataPillar({ position, color }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.8 + position[0]) * 0.12;
      ref.current.rotation.y = clock.elapsedTime * 0.8;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Floating Crystal Core */}
      <mesh castShadow>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} metalness={0.9} />
      </mesh>
      {/* Outer Wireframe Cylinder Cage */}
      <mesh>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 6]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.4} wireframe />
      </mesh>
      {/* Ground Projection Ring */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Giant, pulsing database transmission beam in the central plaza
function PlazaTransmitter() {
  const pillarRef = useRef();
  const beamRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (pillarRef.current) pillarRef.current.rotation.y = -t * 0.6;
    if (beamRef.current?.material) {
      beamRef.current.material.opacity = 0.25 + Math.sin(t * 4) * 0.1;
      beamRef.current.scale.x = 1.0 + Math.sin(t * 3) * 0.05;
      beamRef.current.scale.z = 1.0 + Math.sin(t * 3) * 0.05;
    }
  });

  return (
    <group position={[0, 0.06, 0]}>
      {/* Transmitter Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.24, 16]} />
        <meshStandardMaterial color="#0D1B2A" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rotating Ring Cage */}
      <group ref={pillarRef} position={[0, 0.5, 0]}>
        <mesh>
          <torusGeometry args={[1.1, 0.08, 8, 32]} />
          <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={1.2} wireframe />
        </mesh>
      </group>

      {/* Massive Database Laser Beam (Vertical core) */}
      <mesh ref={beamRef} position={[0, 8.0, 0]}>
        <cylinderGeometry args={[0.55, 0.8, 16, 16]} />
        <meshBasicMaterial color="#00FFE5" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 8.0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 16, 8]} />
        <meshBasicMaterial color="#FFF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function CityEnvironment() {
  const ringRef = useRef();
  
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.12;
    }
  });

  const lamps = useMemo(
    () => [
      [-6, 0, -6],
      [6, 0, -6],
      [-6, 0, 6],
      [6, 0, 6],
      [0, 0, -8],
      [0, 0, 8],
    ],
    []
  );

  const trees = useMemo(
    () => [
      [-17, 0, -5],
      [17, 0, -3],
      [-16, 0, 9],
      [17, 0, 13],
      [-5, 0, -13],
      [8, 0, 14],
    ],
    []
  );

  const segmentRoads = useMemo(() => {
    // Generate actual Road line meshes from our explicit road segments
    return ROAD_SEGMENTS;
  }, []);

  return (
    <group>
      {/* Central Plaza Base Glowing Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[3, 5.5, 64]} />
        <meshBasicMaterial color="#00B4D8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5, 48]} />
        <meshStandardMaterial color="#050C16" emissive="#00B4D8" emissiveIntensity={0.1} metalness={0.7} />
      </mesh>

      {/* Transmitting Plaza Laser Core */}
      <PlazaTransmitter />

      {/* Segmented Roads Speedway */}
      {segmentRoads.map((road, i) => (
        <Road key={i} from={road.from} to={road.to} index={i} />
      ))}

      {/* Cyber Traffic simulation */}
      <TrafficSystem />

      {/* Streetlamps with dynamic flicker */}
      {lamps.map((p, i) => (
        <StreetLamp key={i} position={p} color={i % 2 ? '#7B2FFF' : '#00B4D8'} />
      ))}

      {/* Cyber trees with canopy wireframes */}
      {trees.map((p, i) => (
        <CyberTree key={i} position={p} />
      ))}

      {/* Dynamic Floating Data Pillars */}
      <DataPillar position={[-5, 0, -3.5]} color="#00FFE5" />
      <DataPillar position={[5, 0, 3.5]} color="#7B2FFF" />

      {/* Ground Zone Rings for Districts */}
      {Object.values(DISTRICTS).map((d) => (
        <mesh
          key={d.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[d.position[0], 0.02, d.position[2]]}
        >
          <ringGeometry args={[2.5, 3, 32]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
