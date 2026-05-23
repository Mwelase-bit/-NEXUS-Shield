import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

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
  const body = useRef();
  const lightRef = useRef();

  const rankId = rank?.id ?? 1;
  const hasHeadset = rankId >= 2;
  const hasTactical = rankId >= 3;
  const hasVisor = rankId >= 4;
  const hasCommand = rankId >= 5;
  const hasElite = rankId >= 6;

  const suitColor = hasElite ? '#0a1a2a' : hasCommand ? '#1B3A5C' : '#0D1B2A';
  const trimColor = auraColor;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const walkSpeed = isMoving ? 10 : 0;
    const swing = isMoving ? Math.sin(t * walkSpeed) * 0.45 : 0;
    const bob = isMoving ? Math.abs(Math.sin(t * walkSpeed)) * 0.06 : Math.sin(t * 1.5) * 0.02;

    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.6;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.6;
    if (body.current) body.current.position.y = 0.95 + bob;
    if (group.current) group.current.rotation.y = rotationY;
    if (lightRef.current) lightRef.current.intensity = isMoving ? 1.2 : 0.7;
  });

  const shadowCast = { castShadow: true, receiveShadow: false };

  return (
    <group ref={group} scale={scale}>
      <pointLight ref={lightRef} position={[0, 1.5, 0.5]} color={auraColor} intensity={0.8} distance={5} />

      {isMoving && (
        <Sparkles count={12} scale={[0.8, 0.5, 0.8]} size={1.5} speed={2} color={auraColor} position={[0, 0.3, -0.3]} />
      )}

      {/* Ground aura */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.45, 0.75, 32]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.75, 0.95, 32]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <group ref={leftLeg} position={[-0.14, 0.42, 0]}>
        <mesh position={[0, -0.2, 0]} {...shadowCast}>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color={suitColor} emissive={trimColor} emissiveIntensity={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} {...shadowCast}>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color="#050A14" emissive={trimColor} emissiveIntensity={0.4} />
        </mesh>
      </group>

      <group ref={rightLeg} position={[0.14, 0.42, 0]}>
        <mesh position={[0, -0.2, 0]} {...shadowCast}>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color={suitColor} emissive={trimColor} emissiveIntensity={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} {...shadowCast}>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color="#050A14" emissive={trimColor} emissiveIntensity={0.4} />
        </mesh>
      </group>

      <group ref={body} position={[0, 0.95, 0]}>
        <mesh {...shadowCast}>
          <boxGeometry args={[0.42, 0.55, 0.28]} />
          <meshStandardMaterial color={suitColor} metalness={0.5} roughness={0.4} emissive={trimColor} emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0.16]} {...shadowCast}>
          <boxGeometry args={[0.22, 0.28, 0.04]} />
          <meshStandardMaterial color="#050A14" emissive={trimColor} emissiveIntensity={hasTactical ? 1 : 0.5} />
        </mesh>
        {hasTactical && (
          <mesh position={[0, 0.08, -0.2]} {...shadowCast}>
            <boxGeometry args={[0.35, 0.4, 0.12]} />
            <meshStandardMaterial color="#1B3A5C" emissive={trimColor} emissiveIntensity={0.6} />
          </mesh>
        )}
        {hasCommand && (
          <mesh position={[0.28, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={1.2} />
          </mesh>
        )}
        {hasElite && (
          <mesh position={[-0.28, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={1.5} />
          </mesh>
        )}
      </group>

      <group ref={leftArm} position={[-0.3, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} {...shadowCast}>
          <boxGeometry args={[0.12, 0.38, 0.14]} />
          <meshStandardMaterial color={suitColor} metalness={0.3} />
        </mesh>
      </group>

      <group ref={rightArm} position={[0.3, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} {...shadowCast}>
          <boxGeometry args={[0.12, 0.38, 0.14]} />
          <meshStandardMaterial color={suitColor} metalness={0.3} />
        </mesh>
      </group>

      <group position={[0, 1.38, 0]}>
        <mesh {...shadowCast}>
          <boxGeometry args={[0.32, 0.34, 0.3]} />
          <meshStandardMaterial color="#E8F4FF" roughness={0.3} />
        </mesh>
        {hasVisor && (
          <mesh position={[0, 0.02, 0.14]}>
            <boxGeometry args={[0.34, 0.12, 0.06]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={1.4} transparent opacity={0.9} />
          </mesh>
        )}
        {hasHeadset && (
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.1]} />
            <meshStandardMaterial emissive={trimColor} emissiveIntensity={0.7} color="#1B3A5C" />
          </mesh>
        )}
        {hasElite && (
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.22]} />
            <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={1} wireframe />
          </mesh>
        )}
      </group>

      <Html position={[0, 2.1, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className={`player-nameplate ${isMoving ? 'moving' : ''}`}>
          <strong>{callsign}</strong>
          <span>{rank?.name || 'Analyst'}</span>
        </div>
      </Html>
    </group>
  );
}
