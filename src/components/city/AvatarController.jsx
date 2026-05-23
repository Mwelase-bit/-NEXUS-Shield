import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Avatar from './Avatar';
import { SPAWN_POSITION } from './cityConfig';

const MOVE_SPEED = 6;
const ARRIVE_THRESHOLD = 0.35;

export default function AvatarController({
  callsign,
  rank,
  auraColor,
  navigateTo,
  onPositionChange,
  onArrive,
  onMovingChange,
  enabled = true,
}) {
  const groupRef = useRef();
  const position = useRef({ x: SPAWN_POSITION.x, y: 0, z: SPAWN_POSITION.z });
  const target = useRef(null);
  const rotationY = useRef(0);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const syncTimer = useRef(0);
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState(0);
  const lastMoving = useRef(false);

  useEffect(() => {
    if (navigateTo) target.current = { x: navigateTo.x, z: navigateTo.z };
  }, [navigateTo?.x, navigateTo?.z]);

  useEffect(() => {
    if (!enabled) return;
    const onDown = (e) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = true;
    };
    const onUp = (e) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return;

    let dx = 0;
    let dz = 0;
    let movingNow = false;

    if (keys.current.w) dz -= 1;
    if (keys.current.s) dz += 1;
    if (keys.current.a) dx -= 1;
    if (keys.current.d) dx += 1;

    if (dx !== 0 || dz !== 0) {
      const len = Math.sqrt(dx * dx + dz * dz);
      dx /= len;
      dz /= len;
      target.current = null;
      position.current.x += dx * MOVE_SPEED * delta;
      position.current.z += dz * MOVE_SPEED * delta;
      movingNow = true;
      rotationY.current = Math.atan2(dx, dz);
    } else if (target.current) {
      const { x: tx, z: tz } = target.current;
      const distX = tx - position.current.x;
      const distZ = tz - position.current.z;
      const dist = Math.sqrt(distX * distX + distZ * distZ);

      if (dist < ARRIVE_THRESHOLD) {
        position.current.x = tx;
        position.current.z = tz;
        target.current = null;
        onArrive?.();
      } else {
        position.current.x += (distX / dist) * MOVE_SPEED * delta;
        position.current.z += (distZ / dist) * MOVE_SPEED * delta;
        movingNow = true;
        rotationY.current = Math.atan2(distX, distZ);
      }
    }

    position.current.x = THREE.MathUtils.clamp(position.current.x, -22, 22);
    position.current.z = THREE.MathUtils.clamp(position.current.z, -22, 22);

    groupRef.current.position.set(position.current.x, 0, position.current.z);

    syncTimer.current += delta;
    if (movingNow !== lastMoving.current) {
      lastMoving.current = movingNow;
      onMovingChange?.(movingNow);
    }
    if (syncTimer.current > 0.12) {
      syncTimer.current = 0;
      onPositionChange?.({ x: position.current.x, z: position.current.z });
      setMoving(movingNow);
      setFacing(rotationY.current);
    }
  });

  const scale = 0.85 + (rank?.id ?? 1) * 0.04;

  return (
    <group ref={groupRef} position={[SPAWN_POSITION.x, 0, SPAWN_POSITION.z]}>
      <Avatar
        rotationY={facing}
        isMoving={moving}
        rank={rank}
        auraColor={auraColor}
        callsign={callsign}
        scale={scale}
      />
    </group>
  );
}
