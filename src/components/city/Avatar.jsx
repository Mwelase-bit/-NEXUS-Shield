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
  const droneRef = useRef();
  const torsoRingsRef = useRef();

  const rankId = rank?.id ?? 1;
  const hasHeadset = rankId >= 2;
  const hasTactical = rankId >= 3;
  const hasVisor = rankId >= 4;
  const hasCommand = rankId >= 5;
  const hasElite = rankId >= 6;

  const suitColor = hasElite ? '#0B131E' : hasCommand ? '#14273E' : '#0B1B2C';
  const trimColor = auraColor;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const walkSpeed = isMoving ? 11 : 0;
    
    // Smooth procedural locomotion rigging
    const swing = isMoving ? Math.sin(t * walkSpeed) * 0.5 : 0;
    const bob = isMoving ? Math.abs(Math.sin(t * walkSpeed)) * 0.08 : Math.sin(t * 1.6) * 0.025;
    
    // Leg/arm swings
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.65;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.65;
    
    // Body bobbing and tilting
    if (body.current) {
      body.current.position.y = 0.95 + bob;
      body.current.rotation.z = isMoving ? Math.sin(t * walkSpeed) * 0.04 : 0;
      body.current.rotation.y = isMoving ? Math.sin(t * walkSpeed * 0.5) * 0.03 : 0;
    }
    
    if (group.current) group.current.rotation.y = rotationY;
    if (lightRef.current) lightRef.current.intensity = isMoving ? 1.5 : 0.8;

    // Hover Companion Sentinel Drone orbital coordinates
    if (droneRef.current) {
      const droneRadius = 0.72;
      const droneSpeed = 2.2;
      droneRef.current.position.x = Math.sin(t * droneSpeed) * droneRadius;
      droneRef.current.position.z = Math.cos(t * droneSpeed) * droneRadius - 0.1;
      droneRef.current.position.y = 1.55 + Math.sin(t * 3.5) * 0.06;
      droneRef.current.rotation.y = t * 4;
    }

    // Orbitting tactical chest rings
    if (torsoRingsRef.current) {
      torsoRingsRef.current.rotation.y = t * 2.0;
      torsoRingsRef.current.rotation.x = t * 0.6;
    }
  });

  const shadowCast = { castShadow: true, receiveShadow: false };

  return (
    <group ref={group} scale={scale}>
      <pointLight ref={lightRef} position={[0, 1.5, 0.4]} color={auraColor} intensity={0.9} distance={6} />

      {/* Dynamic Thruster / Foot Sparkles during active walking */}
      {isMoving && (
        <>
          <Sparkles count={16} scale={[0.6, 0.4, 0.6]} size={1.8} speed={2.5} color={auraColor} position={[0, 0.25, -0.4]} />
          {/* Thruster exhaust under boots */}
          <mesh position={[-0.14, 0.08, -0.1]}>
            <coneGeometry args={[0.08, 0.24, 6]} />
            <meshBasicMaterial color={auraColor} transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.14, 0.08, -0.1]}>
            <coneGeometry args={[0.08, 0.24, 6]} />
            <meshBasicMaterial color={auraColor} transparent opacity={0.6} />
          </mesh>
        </>
      )}

      {/* Double Holographic Ground Decal Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.42, 0.72, 32]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.72, 0.92, 32]} />
        <meshBasicMaterial color={auraColor} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLeg} position={[-0.14, 0.42, 0]}>
        <mesh position={[0, -0.2, 0]} {...shadowCast}>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color={suitColor} emissive={trimColor} emissiveIntensity={0.2} metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} {...shadowCast}>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color="#02050A" emissive={trimColor} emissiveIntensity={hasCommand ? 1.0 : 0.4} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLeg} position={[0.14, 0.42, 0]}>
        <mesh position={[0, -0.2, 0]} {...shadowCast}>
          <boxGeometry args={[0.14, 0.42, 0.16]} />
          <meshStandardMaterial color={suitColor} emissive={trimColor} emissiveIntensity={0.2} metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.48, 0.04]} {...shadowCast}>
          <boxGeometry args={[0.16, 0.1, 0.22]} />
          <meshStandardMaterial color="#02050A" emissive={trimColor} emissiveIntensity={hasCommand ? 1.0 : 0.4} />
        </mesh>
      </group>

      {/* Main Torso Body */}
      <group ref={body} position={[0, 0.95, 0]}>
        <mesh {...shadowCast}>
          <boxGeometry args={[0.42, 0.55, 0.28]} />
          <meshStandardMaterial color={suitColor} metalness={0.65} roughness={0.25} emissive={trimColor} emissiveIntensity={0.2} />
        </mesh>
        
        {/* Core Chest Power Matrix Decal */}
        <mesh position={[0, 0.05, 0.16]} {...shadowCast}>
          <boxGeometry args={[0.22, 0.28, 0.04]} />
          <meshStandardMaterial color="#02050A" emissive={trimColor} emissiveIntensity={hasTactical ? 1.8 : 0.8} />
        </mesh>

        {/* Orbiting Chest Gyro-Rings */}
        <group ref={torsoRingsRef} position={[0, 0.05, 0]}>
          <mesh>
            <torusGeometry args={[0.34, 0.02, 6, 24]} />
            <meshBasicMaterial color={auraColor} transparent opacity={hasTactical ? 0.75 : 0.3} />
          </mesh>
        </group>

        {hasTactical && (
          <mesh position={[0, 0.08, -0.2]} {...shadowCast}>
            <boxGeometry args={[0.35, 0.4, 0.12]} />
            <meshStandardMaterial color="#14273E" emissive={trimColor} emissiveIntensity={0.7} />
          </mesh>
        )}
        
        {hasCommand && (
          <mesh position={[0.28, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={1.4} />
          </mesh>
        )}
        {hasElite && (
          <mesh position={[-0.28, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={1.8} />
          </mesh>
        )}
      </group>

      {/* Left Arm */}
      <group ref={leftArm} position={[-0.3, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} {...shadowCast}>
          <boxGeometry args={[0.12, 0.38, 0.14]} />
          <meshStandardMaterial color={suitColor} metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Arm guard shield */}
        {hasCommand && (
          <mesh position={[-0.08, -0.1, 0.02]}>
            <boxGeometry args={[0.04, 0.2, 0.1]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>

      {/* Right Arm */}
      <group ref={rightArm} position={[0.3, 1.05, 0]}>
        <mesh position={[0, -0.18, 0]} {...shadowCast}>
          <boxGeometry args={[0.12, 0.38, 0.14]} />
          <meshStandardMaterial color={suitColor} metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Arm guard shield */}
        {hasCommand && (
          <mesh position={[0.08, -0.1, 0.02]}>
            <boxGeometry args={[0.04, 0.2, 0.1]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>

      {/* Cybernetic Helmet / Head */}
      <group position={[0, 1.38, 0]}>
        <mesh {...shadowCast}>
          <boxGeometry args={[0.32, 0.34, 0.3]} />
          <meshStandardMaterial color="#EAF5FF" roughness={0.2} metalness={0.5} />
        </mesh>
        
        {/* Visor shield */}
        {hasVisor && (
          <mesh position={[0, 0.02, 0.14]}>
            <boxGeometry args={[0.34, 0.14, 0.06]} />
            <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={1.8} transparent opacity={0.9} />
          </mesh>
        )}
        
        {hasHeadset && (
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.1]} />
            <meshStandardMaterial emissive={trimColor} emissiveIntensity={0.8} color="#14273E" />
          </mesh>
        )}
        
        {hasElite && (
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.22]} />
            <meshStandardMaterial color="#00FFE5" emissive="#00FFE5" emissiveIntensity={1.2} wireframe />
          </mesh>
        )}
      </group>

      {/* AWS Cloud Quest-style Hovering Companion Sentinel Drone */}
      <group ref={droneRef}>
        {/* Drone Core Spherical Body */}
        <mesh castShadow>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#0D1B2A" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Outer Orbiting Horizontal Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.02, 4, 16]} />
          <meshBasicMaterial color={auraColor} transparent opacity={0.8} />
        </mesh>
        {/* Drone Engine Eye Lens (Emissive light) */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFF" emissive={auraColor} emissiveIntensity={3} />
        </mesh>
        {/* Downward scanning light beam */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.1, 0.8, 8]} />
          <meshBasicMaterial color={auraColor} transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Clean Premium AWS Cloud Quest-style Nameplate */}
      <Html position={[0, 2.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className={`player-nameplate ${isMoving ? 'moving' : ''}`}>
          <div className="nameplate-crown" style={{ borderColor: auraColor }} />
          <strong>{callsign}</strong>
          <span style={{ color: auraColor }}>{rank?.name || 'Analyst'}</span>
        </div>
      </Html>
    </group>
  );
}
