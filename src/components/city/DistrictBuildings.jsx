import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

function EmissiveWindows({ w, h, d, color, rows = 5, cols = 3 }) {
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = (r + c) % 2 === 0;
      windows.push(
        <mesh
          key={`${r}-${c}`}
          position={[
            (c - (cols - 1) / 2) * (w / (cols + 1)),
            (r - (rows - 1) / 2) * (h / (rows + 1)) + h * 0.1,
            d / 2 + 0.02,
          ]}
        >
          <planeGeometry args={[w / (cols + 2), h / (rows + 2)]} />
          <meshStandardMaterial
            color={on ? color : '#050A14'}
            emissive={on ? color : '#000'}
            emissiveIntensity={on ? 1.2 : 0}
          />
        </mesh>
      );
    }
  }
  return <group>{windows}</group>;
}

function GateTower({ color, accent, selected, hovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.04;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[1.2, 1, 1.2]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 5.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 6.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#FF2D55" emissive="#FF2D55" emissiveIntensity={2} />
      </mesh>
      {/* Neon strips */}
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 2, 1.01]}>
          <boxGeometry args={[0.08, 3.5, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      ))}
      <SelectionRing selected={selected} hovered={hovered} color={color} />
    </group>
  );
}

function CoreSkyscraper({ color, accent, selected, hovered }) {
  const towerMat = useRef();
  useFrame(({ clock }) => {
    if (towerMat.current) {
      towerMat.current.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 1.2) * 0.3;
    }
  });
  return (
    <group>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[2.8, 8, 2.8]} />
        <meshStandardMaterial
          ref={towerMat}
          color="#050A14"
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <EmissiveWindows w={2.6} h={7} d={2.8} color={accent} rows={8} cols={4} />
      <mesh position={[0, 8.8, 0]}>
        <coneGeometry args={[1.8, 1.2, 4]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} wireframe />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3.2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.4} />
    </group>
  );
}

function VaultBunker({ color, accent, selected, hovered }) {
  return (
    <group>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 1.2, 8]} />
        <meshStandardMaterial color="#2a2a2a" emissive={color} emissiveIntensity={0.4} metalness={0.8} />
      </mesh>
      {[[-1.8, 1, 1.51], [1.8, 1, 1.51]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.6, 1.2, 0.1]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <SelectionRing selected={selected} hovered={hovered} color={color} />
    </group>
  );
}

function CloudPlatform({ color, accent, selected, hovered }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.35} floatingRange={[2.2, 2.8]}>
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3.2, 0.5, 16]} />
        <meshStandardMaterial color="#1B3A5C" emissive={color} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.6} wireframe />
      </mesh>
      {/* Light beams */}
      {[0, 1.2, 2.4, 3.6].map((a) => (
        <mesh key={a} position={[Math.cos(a) * 2, 2, Math.sin(a) * 2]} rotation={[0, a, 0]}>
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshBasicMaterial color={accent} transparent opacity={0.35} />
        </mesh>
      ))}
      <SelectionRing selected={selected} hovered={hovered} color={color} y={0.5} />
    </group>
    </Float>
  );
}

function OutpostCluster({ color, accent, selected, hovered }) {
  const huts = [
    [-1.5, 0, -1],
    [1.2, 0, 0.5],
    [0, 0, 1.8],
  ];
  return (
    <group>
      {huts.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <coneGeometry args={[0.9, 0.6, 4]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.2} />
    </group>
  );
}

function BridgeStructure({ color, accent, selected, hovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.children[1]?.material;
      if (mat) mat.opacity = 0.4 + Math.sin(clock.elapsedTime * 3) * 0.2;
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[-2, 0.8, 0]}>
        <boxGeometry args={[1, 1.6, 1]} />
        <meshStandardMaterial color="#1B3A5C" />
      </mesh>
      <mesh position={[2, 0.8, 0]}>
        <boxGeometry args={[1, 1.6, 1]} />
        <meshStandardMaterial color="#1B3A5C" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[6, 0.4, 1.5]} />
        <meshStandardMaterial color="#0D1B2A" emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[5.5, 0.15, 1.2]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} transparent opacity={0.5} wireframe />
      </mesh>
      {/* Data flow along bridge */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
      </mesh>
      <SelectionRing selected={selected} hovered={hovered} color={color} scale={1.1} />
    </group>
  );
}

function SelectionRing({ selected, hovered, color, scale = 1, y = 0.05 }) {
  if (!selected && !hovered) return null;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={scale}>
      <ringGeometry args={[2.8, 3.2, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={selected ? 0.75 : 0.4}
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
      group.current.position.y = base + Math.sin(clock.elapsedTime * 0.5 + position[0]) * 0.02;
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

  const labelY = id === 'CORE' ? 10 : id === 'GATE' ? 7 : id === 'CLOUD' ? 5 : 4;

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
        <div className={`district-label ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}>{name}</div>
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
