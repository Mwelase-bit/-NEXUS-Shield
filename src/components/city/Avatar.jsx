import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Humanoid avatar — low-poly but clearly human.
 * Wears a cybersecurity analyst outfit with headset + wrist device.
 * Walking animation via sine-wave limb oscillation.
 */
export default function Avatar({
  rotationY = 0,
  isMoving = false,
  rank,
  auraColor = '#00B4D8',
  callsign = 'DEFENDER',
  scale = 1,
}) {
  const group = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const bodyGroup = useRef();
  const headGroup = useRef();
  const auraLight = useRef();
  const breathRef = useRef(0);

  const rankId = rank?.id ?? 1;
  const suitDark = '#1A2C3E';
  const suitMid = '#243444';
  const skinColor = '#E8C49A';
  const hairColor = '#1A0A00';

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    breathRef.current += delta;

    const walkSpeed = isMoving ? 9 : 0;
    const swing = isMoving ? Math.sin(t * walkSpeed) * 0.5 : 0;
    // Idle breath / weight shift
    const idleSway = isMoving ? 0 : Math.sin(t * 1.4) * 0.012;
    const idleBob  = isMoving ? Math.abs(Math.sin(t * walkSpeed)) * 0.07
                               : Math.sin(t * 1.4) * 0.018;

    if (leftLeg.current)  leftLeg.current.rotation.x  = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current)  leftArm.current.rotation.x  = -swing * 0.65;
    if (rightArm.current) rightArm.current.rotation.x =  swing * 0.65;

    if (bodyGroup.current) {
      bodyGroup.current.position.y = 0.92 + idleBob;
      bodyGroup.current.rotation.z = idleSway;
    }
    if (headGroup.current) {
      headGroup.current.rotation.y = isMoving ? 0 : Math.sin(t * 0.7) * 0.06;
    }
    if (group.current) group.current.rotation.y = rotationY;
    if (auraLight.current) auraLight.current.intensity = isMoving ? 1.4 : 0.7;
  });

  const sc = { castShadow: true };

  return (
    <group ref={group} scale={scale}>
      {/* Rank-colored point light — player illuminates surroundings */}
      <pointLight ref={auraLight} position={[0, 1.4, 0.3]} color={auraColor} intensity={0.8} distance={5} />

      {/* Footstep sparkles when moving */}
      {isMoving && (
        <Sparkles count={10} scale={[0.5, 0.3, 0.5]} size={1.2} speed={2.5} color={auraColor} position={[0, 0.2, -0.3]} />
      )}

      {/* Aura ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.68, 32]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* ── LEGS ── */}
      <group ref={leftLeg} position={[-0.13, 0.45, 0]}>
        <mesh position={[0, -0.19, 0]} {...sc}>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color={suitDark} metalness={0.2} roughness={0.7} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.46, 0.03]} {...sc}>
          <boxGeometry args={[0.16, 0.09, 0.21]} />
          <meshStandardMaterial color="#050A14" emissive={auraColor} emissiveIntensity={0.4} />
        </mesh>
      </group>

      <group ref={rightLeg} position={[0.13, 0.45, 0]}>
        <mesh position={[0, -0.19, 0]} {...sc}>
          <boxGeometry args={[0.14, 0.42, 0.15]} />
          <meshStandardMaterial color={suitDark} metalness={0.2} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.46, 0.03]} {...sc}>
          <boxGeometry args={[0.16, 0.09, 0.21]} />
          <meshStandardMaterial color="#050A14" emissive={auraColor} emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* ── BODY GROUP (bobs up/down) ── */}
      <group ref={bodyGroup} position={[0, 0.92, 0]}>

        {/* Torso */}
        <mesh {...sc}>
          <boxGeometry args={[0.44, 0.58, 0.29]} />
          <meshStandardMaterial color={suitMid} metalness={0.3} roughness={0.65} emissive={auraColor} emissiveIntensity={0.07} />
        </mesh>

        {/* Chest screen/device */}
        <mesh position={[0, 0.06, 0.155]}>
          <boxGeometry args={[0.2, 0.24, 0.03]} />
          <meshStandardMaterial color="#000C18" emissive={auraColor} emissiveIntensity={rankId >= 3 ? 1.6 : 0.9} />
        </mesh>

        {/* Shoulder epaulettes */}
        {[-0.25, 0.25].map((x, i) => (
          <mesh key={i} position={[x, 0.32, 0]}>
            <boxGeometry args={[0.12, 0.07, 0.32]} />
            <meshStandardMaterial color={auraColor} emissive={auraColor} emissiveIntensity={0.7} />
          </mesh>
        ))}

        {/* ── LEFT ARM ── */}
        <group ref={leftArm} position={[-0.31, 0.1, 0]}>
          <mesh position={[0, -0.19, 0]} {...sc}>
            <boxGeometry args={[0.12, 0.4, 0.14]} />
            <meshStandardMaterial color={suitDark} metalness={0.2} roughness={0.7} />
          </mesh>
          {/* Wrist device */}
          <mesh position={[-0.01, -0.38, 0.05]}>
            <boxGeometry args={[0.13, 0.07, 0.07]} />
            <meshStandardMaterial color="#000C18" emissive="#00FFE5" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* ── RIGHT ARM ── */}
        <group ref={rightArm} position={[0.31, 0.1, 0]}>
          <mesh position={[0, -0.19, 0]} {...sc}>
            <boxGeometry args={[0.12, 0.4, 0.14]} />
            <meshStandardMaterial color={suitDark} metalness={0.2} roughness={0.7} />
          </mesh>
        </group>

        {/* ── HEAD ── */}
        <group ref={headGroup} position={[0, 0.46, 0]}>
          {/* Skull */}
          <mesh {...sc}>
            <boxGeometry args={[0.31, 0.33, 0.29]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Hair / cap top */}
          <mesh position={[0, 0.18, -0.02]}>
            <boxGeometry args={[0.33, 0.1, 0.31]} />
            <meshStandardMaterial color={hairColor} roughness={0.8} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.08, 0.04, 0.148]}>
            <boxGeometry args={[0.06, 0.05, 0.02]} />
            <meshStandardMaterial color="#1A3AFF" emissive="#1A3AFF" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.08, 0.04, 0.148]}>
            <boxGeometry args={[0.06, 0.05, 0.02]} />
            <meshStandardMaterial color="#1A3AFF" emissive="#1A3AFF" emissiveIntensity={0.5} />
          </mesh>
          {/* Headset band */}
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.22, 0.025, 6, 20, Math.PI]} />
            <meshStandardMaterial color="#0A1826" metalness={0.8} />
          </mesh>
          {/* Headset mic arm */}
          <mesh position={[0.22, 0.0, 0.06]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.012, 0.012, 0.25, 6]} />
            <meshStandardMaterial color="#0A1826" metalness={0.8} />
          </mesh>
          <mesh position={[0.26, -0.08, 0.1]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color={auraColor} emissive={auraColor} emissiveIntensity={2} />
          </mesh>
          {/* Visor (rank 4+) */}
          {rankId >= 4 && (
            <mesh position={[0, 0.0, 0.152]}>
              <boxGeometry args={[0.3, 0.1, 0.03]} />
              <meshStandardMaterial color={auraColor} emissive={auraColor} emissiveIntensity={1.8} transparent opacity={0.85} />
            </mesh>
          )}
        </group>
      </group>

      {/* ── Floating rank badge above head ── */}
      <Html position={[0, 2.15, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className={`player-nameplate ${isMoving ? 'moving' : ''}`} style={{ '--aura': auraColor }}>
          <div className="nameplate-rank" style={{ background: auraColor }}>
            {rank?.name?.slice(0, 3) || 'RKT'}
          </div>
          <strong>{callsign}</strong>
        </div>
      </Html>
    </group>
  );
}
