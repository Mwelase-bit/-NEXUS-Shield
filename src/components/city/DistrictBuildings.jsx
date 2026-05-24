import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { DISTRICTS } from './cityConfig';

/** Reusable window panel grid on a building face */
function WindowGrid({ width, height, depth, rows = 4, cols = 3, color = '#FFD966', face = 'front' }) {
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * 3 + c * 5) % 7 !== 0;
      const wx = (c - (cols - 1) / 2) * (width / (cols + 0.5));
      const wy = (r - (rows - 1) / 2) * (height / (rows + 0.8)) + height * 0.05;
      const pos = face === 'front' ? [wx, wy, depth / 2 + 0.01] : [wx, wy, -depth / 2 - 0.01];
      windows.push(
        <mesh key={`${r}-${c}`} position={pos}>
          <planeGeometry args={[width / (cols + 2.5), height / (rows + 2.5)]} />
          <meshStandardMaterial
            color={lit ? color : '#050A14'}
            emissive={lit ? color : '#000'}
            emissiveIntensity={lit ? 1.4 : 0}
            transparent
            opacity={lit ? 0.9 : 0.3}
          />
        </mesh>
      );
    }
  }
  return <group>{windows}</group>;
}

/** Selection / hover ring on ground */
function SelectionRing({ selected, hovered, color, radius = 3.2, y = 0.06 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (selected) ref.current.rotation.z = clock.elapsedTime * 1.2;
  });
  if (!selected && !hovered) return null;
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <ringGeometry args={[radius - 0.25, radius, 40]} />
      <meshBasicMaterial color={color} transparent opacity={selected ? 0.8 : 0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── THE GATE — looks like a security checkpoint gate ─────────────────────────
function GateBuilding({ color, accent, selected, hovered }) {
  const scanRef = useRef();
  const laserRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (scanRef.current) scanRef.current.rotation.y = t * 1.8;
    if (laserRef.current?.material) {
      laserRef.current.material.opacity = 0.5 + Math.sin(t * 8) * 0.35;
    }
  });
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.4, 4]} />
        <meshStandardMaterial color="#1A2A3A" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Left pillar */}
      <group position={[-1.6, 0, 0]}>
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[1.0, 4.0, 1.4]} />
          <meshStandardMaterial color="#1E3A52" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0.52, 2.0, 0]}>
          <boxGeometry args={[0.06, 3.5, 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Right pillar */}
      <group position={[1.6, 0, 0]}>
        <mesh position={[0, 2.0, 0]} castShadow>
          <boxGeometry args={[1.0, 4.0, 1.4]} />
          <meshStandardMaterial color="#1E3A52" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[-0.52, 2.0, 0]}>
          <boxGeometry args={[0.06, 3.5, 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Archway top */}
      <mesh position={[0, 4.3, 0]} castShadow>
        <boxGeometry args={[4.2, 0.7, 1.5]} />
        <meshStandardMaterial color="#253A50" metalness={0.8} />
      </mesh>

      {/* Laser barrier */}
      <mesh ref={laserRef} position={[0, 2.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.0, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>

      {/* Rotating scanner on top */}
      <group position={[0, 4.9, 0]} ref={scanRef}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.15, 0.2, 8]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Shield icon above doorway */}
      <mesh position={[0, 3.4, 0.76]}>
        <boxGeometry args={[0.6, 0.7, 0.04]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={3.5} />
    </group>
  );
}

// ─── THE CORE — tall server tower with racks ──────────────────────────────────
function CoreBuilding({ color, accent, selected, hovered }) {
  const topRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (topRef.current) {
      topRef.current.rotation.y = t * 0.5;
      topRef.current.children[0] && (topRef.current.children[0].material.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4);
    }
  });
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.5, 0.5, 4]} />
        <meshStandardMaterial color="#152030" metalness={0.7} />
      </mesh>

      {/* Main server tower */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[3.0, 7.0, 3.0]} />
        <meshStandardMaterial color="#0E1E2E" metalness={0.85} roughness={0.2} emissive={color} emissiveIntensity={0.08} />
      </mesh>

      {/* Server rack panels on front */}
      {[1.2, 2.0, 2.8, 3.6, 4.4].map((y, i) => (
        <mesh key={i} position={[0, y, 1.52]}>
          <boxGeometry args={[2.5, 0.55, 0.05]} />
          <meshStandardMaterial color="#0A1520" emissive={i % 2 ? color : accent} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Window grids on sides */}
      <WindowGrid width={2.8} height={6.0} depth={3.0} rows={6} cols={3} color={accent} face="front" />

      {/* Two side towers */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[1.0, 4.4, 1.0]} />
            <meshStandardMaterial color="#0D1822" metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* Rotating toroidal crown */}
      <group position={[0, 7.6, 0]} ref={topRef}>
        <mesh>
          <torusGeometry args={[1.2, 0.08, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      </group>

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={3.8} />
    </group>
  );
}

// ─── THE VAULT — heavy fortified bunker ───────────────────────────────────────
function VaultBuilding({ color, accent, selected, hovered }) {
  const dialRef = useRef();
  useFrame(({ clock }) => {
    if (dialRef.current) dialRef.current.rotation.z = -clock.elapsedTime * 0.3;
  });
  return (
    <group>
      {/* Thick base slab */}
      <mesh position={[0, 0.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.5, 1.2, 4.5]} />
        <meshStandardMaterial color="#1A1508" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Main vault body */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[4.5, 3.6, 3.8]} />
        <meshStandardMaterial color="#201A06" metalness={0.85} roughness={0.3} emissive={color} emissiveIntensity={0.07} />
      </mesh>

      {/* Thick reinforcement strips */}
      {[0.6, 1.6, 2.6, 3.6].map((y, i) => (
        <mesh key={i} position={[0, y + 1, 1.92]} receiveShadow>
          <boxGeometry args={[4.6, 0.18, 0.12]} />
          <meshStandardMaterial color="#3A2800" metalness={0.95} />
        </mesh>
      ))}

      {/* Vault door — circular combination wheel */}
      <mesh position={[0, 2.4, 1.93]} castShadow>
        <cylinderGeometry args={[1.3, 1.3, 0.15, 16]} />
        <meshStandardMaterial color="#2A1A00" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Spinning dial */}
      <group position={[0, 2.4, 2.05]} ref={dialRef}>
        <mesh>
          <cylinderGeometry args={[1.1, 1.1, 0.08, 8]} />
          <meshStandardMaterial color="#3A2400" metalness={1} roughness={0.05} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.75, 0, Math.sin(i * Math.PI / 2) * 0.75]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.12, 6]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* Corner buttresses */}
      {[[-2.4, -2.0], [2.4, -2.0], [-2.4, 2.0], [2.4, 2.0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.8, z]} castShadow>
          <boxGeometry args={[0.7, 3.6, 0.7]} />
          <meshStandardMaterial color="#1A1206" metalness={0.9} />
        </mesh>
      ))}

      {/* Gold neon edge trim */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4.2, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={4.0} />
    </group>
  );
}

// ─── CLOUD DISTRICT — cloud platform with floating servers ────────────────────
function CloudBuilding({ color, accent, selected, hovered }) {
  const floatGroup = useRef();
  const orb = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (floatGroup.current) floatGroup.current.rotation.y = t * 0.4;
    if (orb.current) {
      orb.current.position.y = 4.2 + Math.sin(t * 1.8) * 0.2;
      orb.current.children[0].material.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.4;
    }
  });
  return (
    <group>
      {/* Cloud-shaped base — stacked cylinders */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[3.0, 3.2, 1.0, 32]} />
        <meshStandardMaterial color="#1A0A2A" metalness={0.5} roughness={0.6} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {[[-1.2, 0, -0.8], [1.2, 0, -0.8], [0, 0, 0.9]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, 1.1, z]} castShadow>
          <sphereGeometry args={[1.1, 16, 12]} />
          <meshStandardMaterial color="#1F0D35" metalness={0.5} roughness={0.5} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      ))}

      {/* Server box on top of cloud */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[2.2, 1.5, 2.2]} />
        <meshStandardMaterial color="#0D0818" metalness={0.8} roughness={0.3} />
      </mesh>
      <WindowGrid width={2.0} height={1.2} depth={2.2} rows={2} cols={3} color={accent} face="front" />

      {/* Rotating arms */}
      <group ref={floatGroup} position={[0, 3.5, 0]}>
        {[0, 1.05, 2.1].map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#200A3A" emissive={color} emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Central holographic orb */}
      <group ref={orb}>
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} transparent opacity={0.85} metalness={0.9} />
        </mesh>
      </group>

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={3.5} />
    </group>
  );
}

// ─── THE OUTPOST — research station / remote hub ──────────────────────────────
function OutpostBuilding({ color, accent, selected, hovered }) {
  const antRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (antRef.current?.children) {
      antRef.current.children.forEach((c, i) => {
        if (c.material) c.material.emissiveIntensity = 0.5 + Math.sin(t * 5 + i * 1.2) * 0.4;
      });
    }
  });
  const pods = [[-1.4, 0, -1.0], [1.2, 0, 0.6], [0, 0, 1.6]];
  return (
    <group>
      {pods.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.85, 0.9, 1.0, 10]} />
            <meshStandardMaterial color="#0F2015" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <sphereGeometry args={[0.85, 12, 10]} />
            <meshStandardMaterial color="#1A3020" emissive={color} emissiveIntensity={0.25} transparent opacity={0.95} />
          </mesh>
        </group>
      ))}

      {/* Main antenna spire */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.14, 4.5, 6]} />
        <meshStandardMaterial color="#253C30" metalness={0.9} />
      </mesh>
      <group ref={antRef}>
        {[1.0, 1.9, 2.8, 3.7].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        ))}
      </group>

      {/* Laptop dish / satellite dish */}
      <mesh position={[1.5, 2.2, 0]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.6, 0.3, 0.1, 12]} />
        <meshStandardMaterial color="#203A28" emissive={color} emissiveIntensity={0.5} />
      </mesh>

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={3.2} />
    </group>
  );
}

// ─── THE BRIDGE — integration connector hub ───────────────────────────────────
function BridgeBuilding({ color, accent, selected, hovered }) {
  const nodeRef = useRef();
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      const c = (clock.elapsedTime * 0.5) % 1;
      nodeRef.current.position.x = -3.0 + c * 6.0;
      nodeRef.current.material.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 10) * 0.5;
    }
  });
  return (
    <group>
      {/* Two end towers */}
      {[-3.2, 3.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[1.2, 3.6, 1.6]} />
            <meshStandardMaterial color="#2A1505" metalness={0.85} roughness={0.3} />
          </mesh>
          <mesh position={[0, 3.7, 0]}>
            <boxGeometry args={[1.3, 0.2, 1.7]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      {/* Bridge deck */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[6.6, 0.3, 1.4]} />
        <meshStandardMaterial color="#1A0E04" metalness={0.8} />
      </mesh>

      {/* Connector cables */}
      {[-0.55, 0.55].map((z, i) => (
        <mesh key={i} position={[0, 2.5, z]}>
          <boxGeometry args={[6.8, 0.04, 0.04]} />
          <meshBasicMaterial color={accent} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Data packet node traveling the bridge */}
      <mesh ref={nodeRef} position={[0, 2.15, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
      </mesh>

      {/* Link icon (two circles connected) */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.06, 6, 18]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
        </mesh>
      ))}

      <SelectionRing selected={selected} hovered={hovered} color={color} radius={4.2} />
    </group>
  );
}

// ─── Main district building dispatcher ────────────────────────────────────────
function DistrictBuilding({ district, selected, onClick, threat, mission, completedMissions }) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  const { position, color, accent, id, name } = district;
  const isComplete = completedMissions?.includes(id);

  useFrame(({ clock }) => {
    if (group.current && id !== 'CLOUD') {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + position[0] * 0.2) * 0.025;
    }
  });

  const props = { color, accent, selected, hovered };
  const Building = () => {
    switch (id) {
      case 'GATE': return <GateBuilding {...props} />;
      case 'CORE': return <CoreBuilding {...props} />;
      case 'VAULT': return <VaultBuilding {...props} />;
      case 'CLOUD': return <CloudBuilding {...props} />;
      case 'OUTPOST': return <OutpostBuilding {...props} />;
      case 'BRIDGE': return <BridgeBuilding {...props} />;
      default: return null;
    }
  };

  const labelY = id === 'CORE' ? 9.0 : id === 'VAULT' ? 5.2 : id === 'CLOUD' ? 5.8 : 5.5;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'crosshair'; }}
    >
      <Building />

      {/* Building district label */}
      <Html position={[0, labelY + 1.0, 0]} center distanceFactor={20}>
        <div className={`district-label ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}>
          <div className="district-label-dot" style={{ background: color }} />
          <span>{name}</span>
          {isComplete && <span className="district-complete-badge">✓</span>}
        </div>
      </Html>

      {/* Active markers */}
      {(threat || mission) && (
        <Html position={[0, labelY + 0.2, 0]} center distanceFactor={16}>
          <div className={`city-marker ${threat ? 'threat' : 'mission'}`} />
        </Html>
      )}

      {/* Completed — green shield badge */}
      {isComplete && (
        <Html position={[0.8, labelY, 0]} center distanceFactor={16}>
          <div className="district-shield-badge">🛡️</div>
        </Html>
      )}
    </group>
  );
}

export default function DistrictBuildings({ selectedDistrict, onDistrictClick, threatDistrict, missionDistrict, completedMissions = [] }) {
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
          completedMissions={completedMissions}
        />
      ))}
    </>
  );
}
