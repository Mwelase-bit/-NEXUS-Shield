import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { NPCS, MISSIONS, NPC_INTERACT_RADIUS } from './cityConfig';
import OutlineEdge from './OutlineEdge';

/** Single humanoid NPC character */
function NPCCharacter({ npc, playerPos, onInteract, isComplete }) {
  const group = useRef();
  const armRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [nearPlayer, setNearPlayer] = useState(false);
  const [waving, setWaving] = useState(false);

  const { skinTone, clothingColor, accentColor, position, name, role, outfit, missionId } = npc;
  const mission = missionId ? MISSIONS[missionId] : null;
  const hasActiveMission = mission && !isComplete;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Check proximity to player
    if (playerPos) {
      const dx = playerPos.x - position[0];
      const dz = playerPos.z - position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      const wasNear = nearPlayer;
      const isNear = dist < NPC_INTERACT_RADIUS;
      if (isNear !== wasNear) setNearPlayer(isNear);
    }

    // Idle bob / wave
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2 + position[0]) * 0.02;
    }
    if (armRef.current) {
      if (isComplete || !hasActiveMission) {
        // Wave animation for happy/idle NPC
        armRef.current.rotation.z = Math.sin(t * 4) * 0.5 - 0.3;
      } else if (hasActiveMission) {
        // Urgent gesture
        armRef.current.rotation.z = Math.sin(t * 8) * 0.2 - 0.1;
        armRef.current.rotation.x = Math.sin(t * 3) * 0.15;
      }
    }
  });

  const headColor = outfit === 'labcoat' ? '#FFFFFF' : clothingColor;

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'crosshair'; }}
      onClick={(e) => { e.stopPropagation(); if (hasActiveMission) onInteract(npc); }}
    >
      {/* ── NPC Body ── */}
      {/* Legs */}
      <mesh position={[-0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.52, 0.13]} />
        <meshStandardMaterial color={clothingColor} roughness={0.7} />
        <OutlineEdge thickness={0.018} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.52, 0.13]} />
        <meshStandardMaterial color={clothingColor} roughness={0.7} />
        <OutlineEdge thickness={0.018} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.38, 0.5, 0.24]} />
        <meshStandardMaterial color={outfit === 'labcoat' ? '#E8F0F8' : clothingColor} roughness={0.65} />
        <OutlineEdge thickness={0.018} />
      </mesh>

      {/* Role accessory on chest */}
      <mesh position={[0, 0.8, 0.13]}>
        <boxGeometry args={[0.14, 0.16, 0.03]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} />
      </mesh>

      {/* Right arm (waves) */}
      <group ref={armRef} position={[0.26, 0.85, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.11, 0.38, 0.13]} />
          <meshStandardMaterial color={outfit === 'labcoat' ? '#E8F0F8' : clothingColor} roughness={0.7} />
          <OutlineEdge thickness={0.018} />
        </mesh>
      </group>

      {/* Left arm (static) */}
      <mesh position={[-0.26, 0.67, 0]} castShadow>
        <boxGeometry args={[0.11, 0.38, 0.13]} />
        <meshStandardMaterial color={outfit === 'labcoat' ? '#E8F0F8' : clothingColor} roughness={0.7} />
        <OutlineEdge thickness={0.018} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.22, 0]} castShadow>
        <boxGeometry args={[0.27, 0.29, 0.25]} />
        <meshStandardMaterial color={skinTone} roughness={0.55} />
        <OutlineEdge thickness={0.018} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.37, -0.02]}>
        <boxGeometry args={[0.29, 0.1, 0.27]} />
        <meshStandardMaterial color="#1A0A00" roughness={0.8} />
      </mesh>

      {/* Outfit-specific accessory */}
      {outfit === 'labcoat' && (
        <mesh position={[0, 1.24, 0.13]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      )}

      {/* ── Speech bubble / interaction prompt ── */}
      <Html position={[0, 2.2, 0]} center distanceFactor={18}>
        {hasActiveMission && !nearPlayer && (
          <div className="npc-speech-bubble">
            <div className="npc-speech-arrow" />
            <span>{mission.dialogue[0].text.slice(0, 55)}...</span>
          </div>
        )}
        {hasActiveMission && nearPlayer && (
          <div className="npc-interact-prompt">
            <div className="npc-interact-icon">!</div>
            <div className="npc-interact-text">
              <strong>{name}</strong>
              <span>Press E or Click to help</span>
            </div>
          </div>
        )}
        {isComplete && (
          <div className="npc-complete-bubble">
            <span>✓ Thank you!</span>
          </div>
        )}
        {!hasActiveMission && !isComplete && (
          <div className="npc-idle-bubble">
            <span>{npc.idlePhrases[0]}</span>
          </div>
        )}
      </Html>

      {/* Interaction highlight ring on ground */}
      {(hovered || nearPlayer) && hasActiveMission && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.8, 1.1, 24]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

/** XP burst particles — gold dots float upward on mission complete */
export function XPBurst({ position, active }) {
  if (!active) return null;
  return (
    <group position={position}>
      <Sparkles count={24} scale={[3, 5, 3]} size={2.5} speed={1.8} color="#FFB800" position={[0, 2, 0]} />
    </group>
  );
}

/** Renders all NPCs in the city */
export default function CityNPCs({ playerPos, onNPCInteract, completedMissions = [] }) {
  return (
    <group>
      {Object.values(NPCS).map((npc) => (
        <NPCCharacter
          key={npc.id}
          npc={npc}
          playerPos={playerPos}
          onInteract={onNPCInteract}
          isComplete={completedMissions.includes(npc.missionId)}
        />
      ))}
    </group>
  );
}
