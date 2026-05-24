import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

// Helper for window grids on skyscrapers
function EmissiveWindows({ w, h, d, color, rows = 6, cols = 3 }) {
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = (r * 3 + c * 7) % 5 !== 0; // Sci-fi pattern
      windows.push(
        <mesh
          key={`${r}-${c}`}
          position={[
            (c - (cols - 1) / 2) * (w / (cols + 1.2)),
            (r - (rows - 1) / 2) * (h / (rows + 1.2)) + h * 0.08,
            d / 2 + 0.02,
          ]}
        >
          <planeGeometry args={[w / (cols + 2.5), h / (rows + 2.5)]} />
          <meshStandardMaterial
            color={on ? color : '#02050A'}
            emissive={on ? color : '#000'}
            emissiveIntensity={on ? 1.8 : 0}
          />
        </mesh>
      );
    }
  }
  return <group>{windows}</group>;
}

// Checkpoint/Security Gate
function GateTower({ color, accent, selected, hovered }) {
  const scannerRef = useRef();
  const beamRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (scannerRef.current) {
      scannerRef.current.rotation.y = t * 2.5;
    }
    if (beamRef.current?.material) {
      beamRef.current.material.opacity = 0.5 + Math.sin(t * 12) * 0.3;
    }
  });

  return (
    <group>
      {/* Base Foundation */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.4, 3.2]} />
        <meshStandardMaterial color="#0A1420" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Left & Right Gate Pillars */}
      {[-1.1, 1.1].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[0.7, 4.4, 1.8]} />
            <meshStandardMaterial color="#0D1B2A" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Glowing vertical trim */}
          <mesh position={[0, 2.2, 0.91]}>
            <boxGeometry args={[0.1, 3.8, 0.05]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* Laser Barrier Field between columns */}
      <mesh ref={beamRef} position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>

      {/* Overarch */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 2]} />
        <meshStandardMaterial color="#132639" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Rotating Cyber Radar Scanner on Top */}
      <group position={[-0.8, 5.0, 0]} ref={scannerRef}>
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.05, 0.2, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} wireframe />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.3, 0.08]} />
          <meshStandardMaterial color="#FFF" />
        </mesh>
      </group>

      {/* Pulsing Beacon Light */}
      <mesh position={[0.8, 5.0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FF2D55" emissive="#FF2D55" emissiveIntensity={2.5} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} />
    </group>
  );
}

// Majestic Central Skyscraper with rotating Holographic Rings
function CoreSkyscraper({ color, accent, selected, hovered }) {
  const towerMat = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (towerMat.current) {
      towerMat.current.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.3;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z = t * 0.8;
      ringRef1.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 1.4;
      ringRef2.current.rotation.y = Math.cos(t * 0.4) * 0.15;
    }
  });

  return (
    <group>
      {/* Central Mega-Tower */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[2.0, 9.0, 2.0]} />
        <meshStandardMaterial
          ref={towerMat}
          color="#060C14"
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <EmissiveWindows w={1.8} h={8} d={2.0} color={accent} rows={12} cols={4} />

      {/* 4 Outer Structural Columns */}
      {[
        [-1.3, -1.3],
        [-1.3, 1.3],
        [1.3, -1.3],
        [1.3, 1.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 6.4, 8]} />
            <meshStandardMaterial color="#0E1E2F" metalness={0.8} />
          </mesh>
          <mesh position={[0, 6.6, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* Floating Holographic Ring 1 */}
      <group position={[0, 6.0, 0]} rotation={[Math.PI / 2, 0.15, 0]} ref={ringRef1}>
        <mesh>
          <torusGeometry args={[2.5, 0.1, 12, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.65} wireframe />
        </mesh>
      </group>

      {/* Floating Holographic Ring 2 (Counter-rotating) */}
      <group position={[0, 3.5, 0]} rotation={[Math.PI / 2, -0.2, 0]} ref={ringRef2}>
        <mesh>
          <torusGeometry args={[2.9, 0.06, 8, 36]} />
          <meshBasicMaterial color={accent} transparent opacity={0.45} />
        </mesh>
      </group>

      {/* Antenna & Beacon Beam on Top */}
      <mesh position={[0, 9.6, 0]}>
        <cylinderGeometry args={[0.04, 0.1, 1.4, 6]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 10.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={3} />
      </mesh>

      {/* Central Plaza Base Glowing Decal */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.5} />
    </group>
  );
}

// Highly Secure Hexagonal Vault Bunker
function VaultBunker({ color, accent, selected, hovered }) {
  const shieldRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.4;
      shieldRef.current.position.y = 2.4 + Math.sin(t * 2.5) * 0.06;
    }
  });

  return (
    <group>
      {/* Layered Hexagonal Base */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 2.8, 0.8, 6]} />
        <meshStandardMaterial color="#0D1117" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[1.9, 2.2, 0.6, 6]} />
        <meshStandardMaterial color="#161B22" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Core Vault Cylinder */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.2, 16]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>

      {/* Interactive Cyber Shield Panels */}
      <group ref={shieldRef} position={[0, 2.4, 0]}>
        {[-1.6, 0, 1.6].map((x, i) => (
          <mesh key={i} position={[x, 0, i === 1 ? 1.6 : -0.8]} rotation={[0, i * 1.05, 0]}>
            <boxGeometry args={[0.9, 0.7, 0.08]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={1.4}
              transparent
              opacity={0.7}
              metalness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Heavy Security Neon Paths on ground */}
      {[0, Math.PI / 3, (Math.PI * 2) / 3].map((r, i) => (
        <mesh key={i} position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, r]}>
          <planeGeometry args={[0.08, 5.0]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}

      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.3} />
    </group>
  );
}

// Levitating Cloud Platform (Database & Virtual Clusters)
function CloudPlatform({ color, accent, selected, hovered }) {
  const turbineRef = useRef();
  const ringRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (turbineRef.current) turbineRef.current.rotation.y = t * 6;
    if (ringRef.current) ringRef.current.rotation.x = t * 1.5;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[2.3, 2.9]}>
      <group position={[0, 0, 0]}>
        {/* Main Levitating Disk */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[2.5, 2.7, 0.45, 12]} />
          <meshStandardMaterial color="#1B3A5C" emissive={color} emissiveIntensity={0.5} metalness={0.7} />
        </mesh>

        {/* Central Quantum Orb */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.8} metalness={0.9} />
        </mesh>

        {/* Orbiting Laser Ring */}
        <group ref={ringRef} position={[0, 0.7, 0]}>
          <mesh rotation={[0, 0, 0.4]}>
            <torusGeometry args={[1.3, 0.05, 8, 32]} />
            <meshBasicMaterial color="#00FFE5" transparent opacity={0.8} />
          </mesh>
        </group>

        {/* Base Thrust Turbine (Glow Effect underneath disk) */}
        <mesh position={[0, -0.4, 0]} ref={turbineRef}>
          <cylinderGeometry args={[0.8, 0.2, 0.3, 8]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={3} />
        </mesh>

        {/* Energy Projection Beam downwards */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.1, 0.35, 2.6, 8]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} />
        </mesh>

        {/* Floating Pods orbiting the main cluster */}
        {[0, 2.1, 4.2].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 2.2, 0.4, Math.sin(a) * 2.2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.8} />
          </mesh>
        ))}

        <SelectionRing selected={selected} hovered={hovered} color={color} y={0.3} scale={1.2} />
      </group>
    </Float>
  );
}

// Research Base / Outpost with spinning Solar/Wind Collectors
function OutpostCluster({ color, accent, selected, hovered }) {
  const fansRef = useRef();

  useFrame(({ clock }) => {
    if (fansRef.current) {
      fansRef.current.children.forEach((c) => {
        c.rotation.z = clock.elapsedTime * 4.5;
      });
    }
  });

  const pods = [
    [-1.6, 0, -1.2],
    [1.4, 0, 0.6],
    [-0.2, 0, 1.8],
  ];

  return (
    <group>
      {/* Modular Bio-Capsule Pods */}
      {pods.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.9, 0.9, 1.0, 12]} />
            <meshStandardMaterial color="#0F2027" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.9, 12, 12]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Cyber Communication Beacon Spire */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.16, 4.2, 6]} />
          <meshStandardMaterial color="#2C5364" metalness={0.9} />
        </mesh>
        {/* Signal transmission glow spheres */}
        {[1.2, 2.5, 3.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
          </mesh>
        ))}
      </group>

      {/* Spinning Solar Collector Turbines */}
      <group ref={fansRef} position={[0, 0, 0]}>
        {/* Fan 1 */}
        <group position={[-1.6, 1.8, -1.2]} rotation={[0, Math.PI / 4, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 0.8, 0.15]} />
            <meshStandardMaterial color="#FFF" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 0.8, 0.15]} />
            <meshStandardMaterial color="#FFF" />
          </mesh>
        </group>
        {/* Fan 2 */}
        <group position={[1.4, 1.8, 0.6]} rotation={[0, -Math.PI / 4, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 0.8, 0.15]} />
            <meshStandardMaterial color="#FFF" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 0.8, 0.15]} />
            <meshStandardMaterial color="#FFF" />
          </mesh>
        </group>
      </group>

      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.3} />
    </group>
  );
}

// Giant Cybersecurity Bridge Structure with flowing laser node data streams
function BridgeStructure({ color, accent, selected, hovered }) {
  const dataNode = useRef();

  useFrame(({ clock }) => {
    if (dataNode.current) {
      // Moves node back and forth across the bridge structure
      const cycle = (clock.elapsedTime * 0.6) % 1;
      dataNode.current.position.x = -3.2 + cycle * 6.4;
      dataNode.current.material.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 10) * 0.5;
    }
  });

  return (
    <group>
      {/* Heavy Suspension Support Towers */}
      {[-3.2, 3.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[0.8, 3.6, 1.8]} />
            <meshStandardMaterial color="#0A1E36" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Neon crown trim */}
          <mesh position={[0, 3.65, 0]}>
            <boxGeometry args={[0.9, 0.15, 1.9]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} />
          </mesh>
        </group>
      ))}

      {/* Main Bridge Walkway */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[6.8, 0.35, 1.6]} />
        <meshStandardMaterial color="#102A45" metalness={0.8} />
      </mesh>

      {/* Glowing Neon Cyber Suspension Cables */}
      {[0.7, -0.7].map((z, i) => (
        <mesh key={i} position={[0, 2.7, z]} rotation={[0, 0, 0.44 * (i === 0 ? 1 : -1)]}>
          <planeGeometry args={[7.2, 0.05]} />
          <meshBasicMaterial color={accent} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Flowing Laser Data Node */}
      <mesh ref={dataNode} position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.5} />
      </mesh>

      {/* Traffic lane markers */}
      <mesh position={[0, 1.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.2, 0.08]} />
        <meshBasicMaterial color={accent} transparent opacity={0.3} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.3} />
    </group>
  );
}

// Common custom styled selection ring
function SelectionRing({ selected, hovered, color, scale = 1, y = 0.06 }) {
  const ringRef = useRef();
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * (selected ? 1.5 : 0.6);
      ringRef.current.scale.setScalar(scale * (1.0 + Math.sin(clock.elapsedTime * 2.5) * 0.03));
    }
  });

  if (!selected && !hovered) return null;
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <ringGeometry args={[2.5, 2.8, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={selected ? 0.9 : 0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function DistrictBuilding({ district, selected, onClick, threat, mission }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  const { position, color, accent, id, name } = district;

  useFrame(({ clock }) => {
    if (group.current && id !== 'CLOUD') {
      const base = position[1];
      // Adds highly pleasant gentle hover-swimming animation to every building complex
      group.current.position.y = base + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.04;
    }
  });

  const buildingProps = { color, accent, selected, hovered };
  const BuildingMesh = () => {
    switch (id) {
      case 'GATE':
        return <GateTower {...buildingProps} />;
      case 'CORE':
        return <CoreSkyscraper {...buildingProps} />;
      case 'VAULT':
        return <VaultBunker {...buildingProps} />;
      case 'CLOUD':
        return <CloudPlatform {...buildingProps} />;
      case 'OUTPOST':
        return <OutpostCluster {...buildingProps} />;
      case 'BRIDGE':
        return <BridgeStructure {...buildingProps} />;
      default:
        return null;
    }
  };

  const labelY = id === 'CORE' ? 11.2 : id === 'GATE' ? 6.2 : id === 'CLOUD' ? 4.8 : 4.4;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'crosshair';
      }}
    >
      <BuildingMesh />
      
      {(threat || mission) && (
        <Html position={[0, labelY, 0]} center distanceFactor={16}>
          <div className={`city-marker ${threat ? 'threat' : 'mission'}`} />
        </Html>
      )}
      
      <Html position={[0, labelY + 0.8, 0]} center distanceFactor={18}>
        <div className={`district-label ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}>
          <div className="label-accent" style={{ background: color }} />
          {name}
        </div>
      </Html>
    </group>
  );
}

export default function DistrictBuildings({ selectedDistrict, onDistrictClick, threatDistrict, missionDistrict }) {
  return (
    <>
      {Object.values(DISTRICTS).map((d) => (
        <DistrictBuilding
          key={d.id}
          district={d}
          selected={selectedDistrict === d.id}
          onClick={onDistrictClick}
          threat={threatDistrict === d.id}
          mission={missionDistrict === d.id}
        />
      ))}
    </>
  );
}
