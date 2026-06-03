import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { DISTRICTS } from './cityConfig';

// Port attack chain — mirrors Transnet 2021 lateral movement pattern
const PATHS = [
  { from: 'GATE',    to: 'CORE',    label: 'T1566 ➔ T1059 (Phishing ➔ TOS Exec)',         baseProb: 88 },
  { from: 'CORE',    to: 'VAULT',   label: 'T1021 ➔ T1565 (TOS ➔ Manifest Tamper)',        baseProb: 76 },
  { from: 'CORE',    to: 'OUTPOST', label: 'T1021 ➔ T1059 (TOS ➔ Crane SCADA Pivot)',      baseProb: 65 },
  { from: 'OUTPOST', to: 'VAULT',   label: 'T1486 ➔ T1048 (Crane Ransom ➔ Exfil)',         baseProb: 58 },
  { from: 'BRIDGE',  to: 'CORE',    label: 'T1199 ➔ T1021 (Comms Supply Chain ➔ TOS)',     baseProb: 72 },
  { from: 'CORE',    to: 'CLOUD',   label: 'T1078 ➔ T1526 (Cloud Credential Abuse)',        baseProb: 55 },
  { from: 'CLOUD',   to: 'OUTPOST', label: 'T1021 ➔ T1048 (Cloud ➔ Crane Egress)',         baseProb: 45 },
  { from: 'GATE',    to: 'BRIDGE',  label: 'T1566 ➔ T1199 (Gate Phish ➔ Comms Hop)',       baseProb: 38 },
];

function ThreatVector({ fromPos, toPos, probability, label, isActive }) {
  const lineRef = useRef();
  const packetRef = useRef();
  
  // Math to orient a cylinder between A and B
  const { position, rotation, length } = useMemo(() => {
    const A = new THREE.Vector3(...fromPos);
    const B = new THREE.Vector3(...toPos);
    // Raise slightly off ground so it floats
    A.y = 0.45;
    B.y = 0.45;
    
    const dir = new THREE.Vector3().subVectors(B, A);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(A, B).multiplyScalar(0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    const rot = new THREE.Euler().setFromQuaternion(quat);
    
    return { position: mid, rotation: [rot.x, rot.y, rot.z], length: len };
  }, [fromPos, toPos]);

  // Animate the red threat packet running along the path
  useFrame(({ clock }) => {
    if (packetRef.current) {
      const A = new THREE.Vector3(...fromPos);
      const B = new THREE.Vector3(...toPos);
      A.y = 0.45;
      B.y = 0.45;
      
      const speed = isActive ? 1.5 : 0.6;
      const t = (clock.elapsedTime * speed) % 1.0;
      
      packetRef.current.position.copy(A).lerp(B, t);
    }

    if (lineRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 8) * 0.2 + 0.8;
      lineRef.current.material.opacity = isActive ? 0.85 * pulse : 0.25;
      lineRef.current.material.emissiveIntensity = isActive ? 2.5 * pulse : 0.2;
    }
  });

  const beamColor = isActive ? '#FF2D55' : '#FFB800';

  return (
    <group>
      {/* Visual threat pipeline */}
      <mesh position={position} rotation={rotation} ref={lineRef}>
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshStandardMaterial
          color={beamColor}
          emissive={beamColor}
          emissiveIntensity={isActive ? 1.5 : 0.3}
          transparent
          opacity={isActive ? 0.8 : 0.3}
          depthWrite={false}
        />
      </mesh>

      {/* Pulsing hacker packet sphere */}
      <mesh ref={packetRef}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial color="#FF2D55" />
      </mesh>

      {/* Floating 3D GNN prediction details */}
      {isActive && (
        <Html position={[position.x, position.y + 0.8, position.z]} center distanceFactor={14}>
          <div className="threat-path-badge glass-panel">
            <span className="badge-tag">GNN PATH PREDICTION</span>
            <span className="badge-route">{label}</span>
            <span className="badge-prob">{probability}% Likelihood</span>
            <div className="pulse-dot-red" />
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ThreatPathVisualizer() {
  const { state } = useGame();
  
  const activeDistrict = state.activeMission?.district || state.selectedDistrict;
  const isThreatRunning = state.threatLevel !== 'GREEN';

  const processedPaths = useMemo(() => {
    return PATHS.map((path) => {
      // Calculate dynamic route probability based on proximity to threat district
      let probability = path.baseProb;
      let isActive = isThreatRunning && (path.from === activeDistrict || path.to === activeDistrict);
      
      if (isActive) {
        probability = Math.min(98, path.baseProb + 15);
      } else if (!isThreatRunning) {
        isActive = path.from === state.selectedDistrict || path.to === state.selectedDistrict;
        probability = Math.max(10, path.baseProb - 40);
      }

      return {
        ...path,
        fromPos: DISTRICTS[path.from].position,
        toPos: DISTRICTS[path.to].position,
        probability,
        isActive,
      };
    });
  }, [activeDistrict, isThreatRunning, state.selectedDistrict]);

  return (
    <group>
      {processedPaths.map((p, i) => (
        <ThreatVector
          key={i}
          fromPos={p.fromPos}
          toPos={p.toPos}
          probability={p.probability}
          label={p.label}
          isActive={p.isActive}
        />
      ))}
    </group>
  );
}
